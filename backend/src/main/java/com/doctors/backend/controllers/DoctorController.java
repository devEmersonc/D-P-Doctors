package com.doctors.backend.controllers;

import com.doctors.backend.entity.Message;
import com.doctors.backend.entity.User;
import com.doctors.backend.services.DoctorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:4200")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/all-doctors")
    public List<User> getDoctors() {
        return doctorService.getDoctors();
    }

            //Paginator
    /*@GetMapping("/doctors/page/{page}")
    public Page<User> getDoctors(@PathVariable Integer page) {
        return doctorService.findAll(PageRequest.of(page, 9));
    }*/


    @GetMapping("/doctor/{id}")
    public User getDoctor(@PathVariable Long id) {
        return doctorService.getDoctor(id);
    }

    @GetMapping("/doctor/email")
    public ResponseEntity<?> findDoctorByEmail(@RequestParam(value = "email") String email){
        User doctor = doctorService.findByEmail(email);

        Map<String, Object> response = new HashMap<>();

        if(doctor == null){
            response.put("message", "Usuario no encontrado.");
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
        }

        try{
            doctorService.existsByEmail(doctor.getEmail());
        }catch (Exception e){
            response.put("message", "Error al realizar la consulta.");
            response.put("error", e.getMessage());
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User doctor, BindingResult result) {
        User newDoctor = null;
        Map<String, Object> response = new HashMap<>();

        if (result.hasErrors()) {
            List<String> errors = new ArrayList<>();
            for (FieldError err : result.getFieldErrors()) {
                errors.add(err.getDefaultMessage());
            }

            response.put("errors", errors);
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
        }

        if (doctorService.existsByEmail(doctor.getEmail())) {
            response.put("error", "El email ya está en uso.");
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
        }

        try {
            newDoctor = doctorService.registerDoctor(doctor);
        } catch (Exception e) {
            response.put("message", "Error al realizar el insert en la base de datos.");
            response.put("error", e.getMessage());
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        response.put("message", "El doctor se ha registrado con éxito.");
        response.put("doctor", newDoctor);
        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@Valid @RequestBody User doctor, BindingResult result, @PathVariable Long id) {
        User currentDoctor = doctorService.getDoctor(id);
        User updatedDoctor = null;
        Map<String, Object> response = new HashMap<>();

        if (result.hasErrors()) {
            List<String> errors = new ArrayList<>();
            for (FieldError err : result.getFieldErrors()) {
                errors.add(err.getDefaultMessage());
            }

            response.put("errors", errors);
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
        }

        if (currentDoctor == null) {
            response.put("message", "El doctor no existe en la base de datos.");
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
        }

        try {
            updatedDoctor = doctorService.updatedDoctor(doctor, id);
        } catch (Exception e) {
            response.put("message", "Error al realizar la actualizacion en la base de datos.");
            response.put("error", e.getMessage());
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        response.put("message", "El doctor se ha actualizado con éxito.");
        response.put("doctor", updatedDoctor);
        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
    }

    @PostMapping("/upload/image")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile image, @RequestParam("id") Long id) {
        Map<String, Object> response = new HashMap<>();
        User doctor = doctorService.getDoctor(id);

        if (!image.isEmpty()) {
            String imageName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename().replace(" ", "");
            Path imagePath = Paths.get("uploads").resolve(imageName).toAbsolutePath();

            try {
                Files.copy(image.getInputStream(), imagePath);
            } catch (IOException e) {
                response.put("message", "Error al subir la imagen.");
                response.put("error", e.getMessage().concat(": ").concat(e.getCause().getMessage()));
                return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            //Validar si el cliente ya tiene una foto o no, si ya existe, eliminamos la foto anterior y actualizamos por la nueva
            String namePreviousImage = doctor.getPhoto();

            if (namePreviousImage != null && namePreviousImage.length() > 0) {
                Path previousImageRoute = Paths.get("uploads").resolve(namePreviousImage).toAbsolutePath();
                File previousImageFile = previousImageRoute.toFile();

                if (previousImageFile.exists() && previousImageFile.canRead()) {
                    previousImageFile.delete();
                }
            }

            doctor.setPhoto(imageName);
            doctorService.updatedDoctor(doctor, id);

            response.put("message", "Se ha actualizado la imagen con éxito.");
            response.put("doctor", doctor);
        }

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
    }

    @GetMapping("/view/img/{imageName:.+}")
    public ResponseEntity<Resource> viewImage(@PathVariable String imageName) {

        Path filePath = Paths.get("uploads").resolve(imageName).toAbsolutePath();
        Resource recurso = null;

        try {
            recurso = new UrlResource(filePath.toUri());
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }

        if (!recurso.exists() && !recurso.isReadable()) {
            filePath = Paths.get("src/main/resources/static/images").resolve("user_icon.png").toAbsolutePath();

            try {
                recurso = new UrlResource(filePath.toUri());
            } catch (MalformedURLException e) {
                e.printStackTrace();
            }
        }

        HttpHeaders header = new HttpHeaders();
        header.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + recurso.getFilename() + "\"");

        return new ResponseEntity<Resource>(recurso, header, HttpStatus.OK);
    }

    @PostMapping("/message/{user_id}")
    public ResponseEntity<?> saveMessage(@Valid @RequestBody Message message, BindingResult result, @PathVariable Long user_id) {
        User user = doctorService.getDoctor(user_id);
        Map<String, Object> response = new HashMap<>();

        if (result.hasErrors()) {
            List<String> errors = new ArrayList<>();
            for (FieldError err : result.getFieldErrors()) {
                errors.add(err.getDefaultMessage());
            }

            response.put("errors", errors);
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
        }

        try {
            doctorService.saveMessage(message, user);
        } catch (Exception e) {
            response.put("message", "Error al guardar el mensaje.");
            response.put("error", e.getMessage());
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        response.put("message", "El mensaje se ha guardado con éxito.");
        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/doctor/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id){
        Map<String, Object> response = new HashMap<>();

        try{
            User patient = doctorService.getDoctor(id);

            if(patient != null){
                String previousNamePhoto = patient.getPhoto();
                if(previousNamePhoto != null && previousNamePhoto.length() > 0){
                    Path previousPhotoRoute = Paths.get("uploads").resolve(previousNamePhoto).toAbsolutePath();
                    File previousPhotoFile = previousPhotoRoute.toFile();

                    if(previousPhotoFile.exists() && previousPhotoFile.canRead()){
                        previousPhotoFile.delete();
                    }
                }

                doctorService.deleteDoctor(id);
                response.put("message", "Se ha eliminado al doctor con éxito.");
                return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
            }

            response.put("message", "El doctor no existe.");
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
        }catch(Exception e){
            response.put("message", "Error al eliminar al doctor");
            response.put("error", e.getMessage());
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/message/{message_id}")
    public Message findMessageById(@PathVariable Long message_id){
        return doctorService.findMessageById(message_id);
    }

    @DeleteMapping("/delete/message/{message_id}")
    public void deleteMessage(@PathVariable Long message_id){
        doctorService.deleteMessageById(message_id);
    }
}