package com.project.loyalty.exception;
import org.springframework.http.*; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestControllerAdvice public class GlobalExceptionHandler {
 @ExceptionHandler(ApiException.class) public ResponseEntity<?> api(ApiException e){return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));}
 @ExceptionHandler(MethodArgumentNotValidException.class) public ResponseEntity<?> validation(MethodArgumentNotValidException e){String m=e.getBindingResult().getFieldErrors().stream().findFirst().map(x->x.getField()+" "+x.getDefaultMessage()).orElse("Invalid input"); return ResponseEntity.badRequest().body(Map.of("error",m));}
 @ExceptionHandler(Exception.class) public ResponseEntity<?> other(Exception e){return ResponseEntity.status(500).body(Map.of("error",e.getMessage()==null?"Server error":e.getMessage()));}
}
