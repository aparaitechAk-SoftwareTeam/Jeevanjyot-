const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const connectDB = require("../config/db");
const Treatment = require("../models/Treatment");

const rawData = [
  // MASSAGE (17)
  { name: "Abhyangam – Neck & Shoulder", category: "Massage" },
  { name: "Almond Oil Foot Massage", category: "Massage" },
  { name: "Aroma Massage – Full Back", category: "Massage" },
  { name: "Aroma Oil Foot Reflexology", category: "Massage" },
  { name: "Aroma Massage – Full Legs", category: "Massage" },
  { name: "Acupressure Massage", category: "Massage" },
  { name: "Almond Oil Body Massage", category: "Massage" },
  { name: "Aroma Massage", category: "Massage" },
  { name: "Almond Oil Head And Shoulder Massage", category: "Massage" },
  { name: "Abhyangam Massage", category: "Massage" },
  { name: "Kerala Ayurvedic Massage", category: "Massage" },
  { name: "Almond Oil Head Massage With Steam And Wash", category: "Massage" },
  { name: "Abhyangam With Dhara Massage", category: "Massage" },
  { name: "Ayurvedic Massage", category: "Massage" },
  { name: "Body Massage", category: "Massage" },
  { name: "Abhyangam – Legs & Feet", category: "Massage" },
  { name: "Acupressure Foot Massage", category: "Massage" },

  // MANAGEMENT (5)
  { name: "Arthritis", category: "Management" },
  { name: "Allergy", category: "Management" },
  { name: "Physiotherapy and Pain Management", category: "Management" },
  { name: "Type 2 Diabetes Management", category: "Management" },
  { name: "Diabetes Management", category: "Management" },

  // SKIN CARE (3)
  { name: "Sinusitis", category: "Skin Care" },
  { name: "Anti Scar Treatment", category: "Skin Care" },
  { name: "Skin Treatment", category: "Skin Care" },

  // THERAPY (3)
  { name: "Sexual Wellness Therapy", category: "Therapy" },
  { name: "Shirovasti", category: "Therapy" },
  { name: "Obesity Physiotherapy", category: "Therapy" },

  // SERVICES (2)
  { name: "Strains and Muscle Cramp", category: "Services" },
  { name: "Home Visit", category: "Services" },

  // BODY CARE (1)
  { name: "Ayurvedic Therapies", category: "Body Care" },

  // SURGERY (1)
  { name: "Anal Fissure (Ulcer)", category: "Surgery" },

  // GENDER (2)
  { name: "Women", category: "Gender" },
  { name: "Men", category: "Gender" },

  // AMENITIES (3)
  { name: "Private Rooms", category: "Amenities" },
  { name: "Parking Available", category: "Amenities" },
  { name: "Air Conditioned", category: "Amenities" },

  // TREATMENT (122)
  { name: "Swallowing Problem", category: "Treatment" },
  { name: "Phobia", category: "Treatment" },
  { name: "Spinal Polio", category: "Treatment" },
  { name: "Adenoid Basal Cell Carcinoma", category: "Treatment" },
  { name: "Siddha For Arthritis", category: "Treatment" },
  { name: "Periapical Periodontitis", category: "Treatment" },
  { name: "Tibialis Tendinitis", category: "Treatment" },
  { name: "Y Linked Deafness", category: "Treatment" },
  { name: "Stuffy Nose", category: "Treatment" },
  { name: "Pharyngoconjunctival Fever", category: "Treatment" },
  { name: "Siddha For Diabetes", category: "Treatment" },
  { name: "Viral Laryngitis", category: "Treatment" },
  { name: "Pharyngitis", category: "Treatment" },
  { name: "Personality Disorder", category: "Treatment" },
  { name: "Smell And Taste Disorders", category: "Treatment" },
  { name: "Skeletal Muscle Disease", category: "Treatment" },
  { name: "Zebra Body Myopathy", category: "Treatment" },
  { name: "Salivary Gland Adenoid Cystic Carcinoma", category: "Treatment" },
  { name: "Poor Eye Sight", category: "Treatment" },
  { name: "Shoulder Injuries", category: "Treatment" },
  { name: "Progressive Muscular Dystrophy", category: "Treatment" },
  { name: "Spondyloarthropathies", category: "Treatment" },
  { name: "Spastic Hemiplegia", category: "Treatment" },
  { name: "Scapuloperoneal Spinal Muscular Atrophy", category: "Treatment" },
  { name: "Pharynx Squamous Cell Carcinoma", category: "Treatment" },
  { name: "Psychosexual Problems", category: "Treatment" },
  { name: "Spinal Muscular Atrophy", category: "Treatment" },
  { name: "Throat Cancer", category: "Treatment" },
  { name: "Sphenoid Sinusitis", category: "Treatment" },
  { name: "Yoon Bellen Neurodevelopmental Syndrome", category: "Treatment" },
  { name: "Alcoholic Liver Disease", category: "Treatment" },
  { name: "Wrist Problems", category: "Treatment" },
  { name: "Acute Apical Periodontitis", category: "Treatment" },
  { name: "Rigid Spine Muscular Dystrophy", category: "Treatment" },
  { name: "Post Core", category: "Treatment" },
  { name: "Tibial Nerve Palsy", category: "Treatment" },
  { name: "Salivary Gland Mucinous Adenocarcinoma", category: "Treatment" },
  { name: "Penile Disorders", category: "Treatment" },
  { name: "Small Penis Size", category: "Treatment" },
  { name: "Vitamin Metabolic Disorder", category: "Treatment" },
  { name: "Tibial Muscular Dystrophy", category: "Treatment" },
  { name: "Pelvic Muscle Wasting", category: "Treatment" },
  { name: "Spastic Quadriplegic Cerebral Palsy", category: "Treatment" },
  { name: "Voice Change", category: "Treatment" },
  { name: "Penis Pain", category: "Treatment" },
  { name: "Sports Injuries", category: "Treatment" },
  { name: "Adenofibroma", category: "Treatment" },
  { name: "X Linked Nonsyndromic Deafness", category: "Treatment" },
  { name: "Adenoid Cystic Carcinoma", category: "Treatment" },
  { name: "Shoulder Pain", category: "Treatment" },
  { name: "Physiotherapy for Back and Neck Pain", category: "Treatment" },
  { name: "Periarthritis", category: "Treatment" },
  { name: "Rejuvenation", category: "Treatment" },
  { name: "Skin Allergy", category: "Treatment" },
  { name: "Snehan Swedan", category: "Treatment" },
  { name: "Penis Enlargement", category: "Treatment" },
  { name: "Respiratory Tract Infection (RTI)", category: "Treatment" },
  { name: "Slip disc", category: "Treatment" },
  { name: "Respiratory Allergy", category: "Treatment" },
  { name: "Migraine", category: "Treatment" },
  { name: "Psychiatric Disorders", category: "Treatment" },
  { name: "White Gray Hair", category: "Treatment" },
  { name: "Children With Developmental Delay", category: "Treatment" },
  { name: "Rhinitis", category: "Treatment" },
  { name: "Sexual Disorders", category: "Treatment" },
  { name: "Scanty Periods", category: "Treatment" },
  { name: "Swollen Gums", category: "Treatment" },
  { name: "Weight Loss and Gain", category: "Treatment" },
  { name: "Whooping Cough", category: "Treatment" },
  { name: "Snoring", category: "Treatment" },
  { name: "Fluency And Voice Disorders", category: "Treatment" },
  { name: "Prostate enlargement", category: "Treatment" },
  { name: "Sore Throat", category: "Treatment" },
  { name: "Skin Brightening", category: "Treatment" },
  { name: "Raktamokshan", category: "Treatment" },
  { name: "Tinnitus", category: "Treatment" },
  { name: "Weight Loss Counselling", category: "Treatment" },
  { name: "Spine Mobilization", category: "Treatment" },
  { name: "Vomiting", category: "Treatment" },
  { name: "Spine Problem", category: "Treatment" },
  { name: "Ringworm", category: "Treatment" },
  { name: "Sciatica Pain", category: "Treatment" },
  { name: "Tonsil Inflammation (Tonsillitis)", category: "Treatment" },
  { name: "Rotator Cuff Strain", category: "Treatment" },
  { name: "Sleeplessness (Insomnia)", category: "Treatment" },
  { name: "pelvic organ prolapse", category: "Treatment" },
  { name: "Vulvitis", category: "Treatment" },
  { name: "Uterine Prolapse", category: "Treatment" },
  { name: "Premature menopause", category: "Treatment" },
  { name: "Pregnancy Depression", category: "Treatment" },
  { name: "Acute Cervicitis", category: "Treatment" },
  { name: "Postmenopausal Atrophic Vaginitis", category: "Treatment" },
  { name: "Vaginal Discharge", category: "Treatment" },
  { name: "Uterus Carcinoma In Situ", category: "Treatment" },
  { name: "Ulceration Of Vulva", category: "Treatment" },
  { name: "Vaginal Endometrial Stromal Tumor", category: "Treatment" },
  { name: "Pregnancy Hypertension (Preeclampsia Eclampsia)", category: "Treatment" },
  { name: "Vaginal Adenoma", category: "Treatment" },
  { name: "Uterine Benign Neoplasm", category: "Treatment" },
  { name: "Uterine anomalies", category: "Treatment" },
  { name: "Pregnancy with Endocrine Disorders", category: "Treatment" },
  { name: "Polycystic Ovary Syndrome", category: "Treatment" },
  { name: "Vulvovaginitis", category: "Treatment" },
  { name: "Vaginal Benign Neoplasm", category: "Treatment" },
  { name: "Premenstrual Dysphoric Disorder", category: "Treatment" },
  { name: "Prevention In Gynaecological Cancer", category: "Treatment" },
  { name: "Vulval Melanoma", category: "Treatment" },
  { name: "Vaginal Carcinosarcoma", category: "Treatment" },
  { name: "Primary Ovarian Insufficiency", category: "Treatment" },
  { name: "Polycystic Ovary Syndrome In Adolescence", category: "Treatment" },
  { name: "White Discharge Per Vaginum", category: "Treatment" },
  { name: "Acute Endometritis", category: "Treatment" },
  { name: "Pelvic Varices", category: "Treatment" },
  { name: "Uterine Corpus Adenosarcoma", category: "Treatment" },
  { name: "Adenomyosis", category: "Treatment" },
  { name: "Vaginal Abscess", category: "Treatment" },
  { name: "Pregnancy Adenoma", category: "Treatment" },
  { name: "Uterine Hypoplasia", category: "Treatment" },
  { name: "Premature Ovarian Failure", category: "Treatment" },
  { name: "Uterine Fibroid", category: "Treatment" },
  { name: "Adhesions Of Uterus", category: "Treatment" },
  { name: "Vaginal Endometrial Stromal Sarcoma", category: "Treatment" }
];

const seedTreatments = async () => {
  try {
    await connectDB();

    const existingTreatments = await Treatment.find({});
    const existingMap = new Map();
    existingTreatments.forEach((t) => {
      const key = `${t.name.trim().toLowerCase()}||${t.category.trim().toLowerCase()}`;
      existingMap.set(key, true);
    });

    let importedCount = 0;
    let skippedCount = 0;
    const categoryCounts = {
      Treatment: 0,
      Massage: 0,
      Management: 0,
      "Skin Care": 0,
      Therapy: 0,
      Services: 0,
      "Body Care": 0,
      Surgery: 0,
      Gender: 0,
      Amenities: 0,
    };

    const now = Date.now();

    for (let i = 0; i < rawData.length; i++) {
      const item = rawData[i];
      const key = `${item.name.trim().toLowerCase()}||${item.category.trim().toLowerCase()}`;

      if (existingMap.has(key)) {
        skippedCount++;
        continue;
      }

      const treatmentId = `JJT-IMP-${now}-${i + 1}`;

      await Treatment.create({
        treatmentId,
        name: item.name.trim(),
        category: item.category,
        description: item.name.trim(),
        duration: "Consultation standard",
        consultationRequirement: "Required prior to treatment",
        displayOrder: i + 1,
        isActive: true,
      });

      existingMap.set(key, true);
      importedCount++;
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }

    console.log("=== TREATMENT SEED RESULTS ===");
    console.log(`Total imported: ${importedCount}`);
    console.log(`Total skipped (duplicates): ${skippedCount}`);
    console.log("Breakdown by category:", JSON.stringify(categoryCounts, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("Seed treatments error:", error);
    process.exit(1);
  }
};

seedTreatments();
