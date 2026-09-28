package com.project.loyalty.dto;
import jakarta.validation.constraints.Positive;
public class EarnRequest { @Positive private double purchaseAmount; private String note; public double getPurchaseAmount(){return purchaseAmount;} public void setPurchaseAmount(double v){purchaseAmount=v;} public String getNote(){return note;} public void setNote(String v){note=v;} }
