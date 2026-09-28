package com.project.loyalty.dto;
import jakarta.validation.constraints.NotNull;
public class AdjustmentRequest { @NotNull private Integer points; private String note; public Integer getPoints(){return points;} public void setPoints(Integer p){points=p;} public String getNote(){return note;} public void setNote(String n){note=n;} }
