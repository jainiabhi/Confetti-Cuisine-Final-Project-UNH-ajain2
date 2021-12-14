"use strict";

const mongoose = require("mongoose"),
    { Schema } = require("mongoose");

var vacationSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true,
            default: "None specified"
        },
        heroImage: {
            type: String,
            required: true
        },
        cuisine: {
            type: String,
            required: true,
            enum: ["", "Continental", "Traditional", "Haute-cuisine", "Nouvelle-cuisine", "Fusion", "Vegan", "Vegetarian", "Asian", "Indian", "Middle-Eastern", "African", "Central American", "South American"]
        },
        cost: {
            type: Number,
            default: 0,
            min: [0, "Course cannot have a negative cost"]
        },
        maxTravelers: {
            type: Number,
            default: 0,
            max: [25, "Vacation packages cannot have more than 25 travelers"],
            min: [0, "Vacation packages cannot have a negative number of travelers"]
        },
        destination: {
            type: String,
            required: true,
            default: "None specified"
        },
        departureLocation: {
            type: String,
            required: true,
            enum: ["", "New York (JFK)", "Boston (BOS)", "Chicago (ORD)", "Miami (MIA)", "St. Louis (STL)", "Dallas (DFW)", "Seattle (SEA)", "San Francisco (SFO)"]
        },
        departureDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        returnDate: {
            type: Date,
            required: true,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Vacation", vacationSchema);
