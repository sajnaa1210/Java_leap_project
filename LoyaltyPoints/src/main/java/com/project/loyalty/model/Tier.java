package com.project.loyalty.model;
public enum Tier {
    BRONZE(0,1.0,0), SILVER(1000,1.25,5), GOLD(3000,1.5,10), PLATINUM(7000,2.0,15);
    private final int threshold; private final double multiplier; private final double discountPercent;
    Tier(int threshold,double multiplier,double discountPercent){this.threshold=threshold;this.multiplier=multiplier;this.discountPercent=discountPercent;}
    public int getThreshold(){return threshold;} public double getMultiplier(){return multiplier;} public double getDiscountPercent(){return discountPercent;}
    public static Tier fromLifetimePoints(int p){ if(p>=7000)return PLATINUM; if(p>=3000)return GOLD; if(p>=1000)return SILVER; return BRONZE; }
}
