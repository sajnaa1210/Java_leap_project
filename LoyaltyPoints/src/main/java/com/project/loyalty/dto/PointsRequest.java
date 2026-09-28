package com.project.loyalty.dto;
import jakarta.validation.constraints.Positive;
public class PointsRequest { @Positive private int points; private String note; public int getPoints(){return points;} public void setPoints(int p){points=p;} public String getNote(){return note;} public void setNote(String n){note=n;} }
