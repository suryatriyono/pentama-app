import { Gender } from "@prisma/client";

// Basic education lavel
type Level = "Diploma" | "S1" | "S2" | "S3" | "unknown";

// Type for parsed NIP data
export type ParseNim = {
  nim: string;
  faculty: string;
  facultyCode: string;
  educationLevel: Level;
  educationLevelCode: string;
  programCode: string;
  programStudy: string;
  regularityCode: "Reguler" | "Non-Reguler";
  entryYear: string;
  semesterCode: "Ganjil" | "Genap";
  registrationNumber: string
}

// Type for parsed NIP data
export type ParseNip = {
  nip: string;
  birthDate: {
    full: string;
    year: string;
    month: string;
    day: string;
  };
  appointmentDate: {
    full: string,
    year: string,
    month: string
  };
  serialNumber: string
  gender: Gender
}

// Return type for identity validation
type ValidationResult = {
  valid: boolean,
  type: "NIM" | "NIP" | "UNKNOWN",
  details: ParseNim | ParseNip | null
}


export class IdentityExtractor {
  facultyCodes: Record<string, string>;
  educationLevels: Record<string, string>;
  programStudies: Record<string, Record<string, string>>;
  nimRegex: RegExp;
  nipRegex: RegExp;

  constructor() {
    // Mapping faculty code
    this.facultyCodes = {
      "A": "Hukum",
      "B": "Ekonomi",
      "C": "Kedokteran",
      "D": "Teknik",
      "E": "Pertanian",
      "F": "Keguruan dan Ilmu Pendidikan",
      "G": "Ilmu Sosial dan Ilmu Politik",
      "H": "Matematika dan Ilmu Pengetahuan Alam",
    }

    // Mapping education level
    this.educationLevels = {
      "0": "Diploma",
      "1": "S1 (Sarjana)",
      "2": "S2 (Magister)",
      "3": "S3 (Doktor)"
    }

    // Mapping program studies by faculty code and program code
    this.programStudies = {
      "A": { // Fakultas Hukum
        "01": "Ilmu Hukum",
        "02": "Hukum Bisnis",
      },
      "B": { // Fakultas Ekonomi
        "01": "Manajemen",
        "02": "Akuntansi",
        "03": "Ekonomi Pembangunan",
      },
      "C": { // Fakultas Kedokteran
        "01": "Pendidikan Dokter",
        "02": "Ilmu Keperawatan",
      },
      "D": { // Fakultas Teknik
        "01": "Teknik Sipil",
        "02": "Teknik Elektro",
        "03": "Teknik Mesin",
        "04": "Teknik Informatika",
        "05": "Sistem Informasi",
      },
      "E": { // Fakultas Pertanian
        "01": "Agribisnis",
        "02": "Agroteknologi",
      },
      "F": { // Fakultas Keguruan dan Ilmu Pendidikan
        "01": "Pendidikan Matematika",
        "02": "Pendidikan Bahasa Indonesia",
        "03": "Pendidikan Bahasa Inggris",
      },
      "G": { // Fakultas Ilmu Sosial dan Ilmu Politik
        "01": "Ilmu Administrasi Negara",
        "02": "Sosiologi",
        "03": "Ilmu Komunikasi",
      },
      "H": { // Fakultas Matematika dan Ilmu Pengetahuan Alam
        "01": "Matematika",
        "02": "Fisika",
        "03": "Kimia",
        "04": "Biologi",
        "05": "Ilmu Komputer",
      }
    }

    // Regular expression for NIM adn NIP
    this.nimRegex = /^[A-Z]\d{10}$/; // Format like H1051211028
    this.nipRegex = /^\d{18}$/; // Format NIP 18 digit
  }

  // Get program study name based on faculty code and program code
  private getProgramStudy(facultyCode: string, programCode: string): string {
    if (this.programStudies[facultyCode] && this.programStudies[facultyCode][programCode]) {
      return this.programStudies[facultyCode][programCode];
    }
    return "Unknown Study Programmes";
  }

  /**
* Determines gender based on digit value
* Using the common convention: 
* - Odd numbers (1,3,5,7,9) typically represent MALE
* - Even numbers (0,2,4,6,8) typically represent FEMALE
* 
* Note: This is based on common practices in some institutions
* and might not be accurate for all NIP numbers across all departments
*/
  private determineGender(digit: number): Gender {
    // Odd numbers for male, even numbers for female
    if (isNaN(digit)) return "UNKNOWN";
    return digit % 2 === 1 ? "MALE" : "FEMALE";
  }

  // Parse NIM for get details information
  parseNim(nim: string): ParseNim | null {
    if (!nim || nim.length !== 11) return null;

    const facultyCode = nim.charAt(0);
    const educationLevel = nim.charAt(1);
    const programCode = nim.substring(2, 4);
    const regularityCode = nim.charAt(4);
    const entryYear = nim.substring(5, 7);
    const semesterCode = nim.charAt(7);
    const registrationNumber = nim.substring(8, 11);
    // Get Program study based on faculty dan program code
    const programStudy = this.getProgramStudy(facultyCode, programCode);

    return {
      nim: nim,
      faculty: this.facultyCodes[facultyCode] || "unknown",
      facultyCode: facultyCode,
      educationLevel: this.educationLevels[educationLevel] as Level || "unknown",
      educationLevelCode: educationLevel,
      programCode: programCode,
      programStudy: programStudy,
      regularityCode: regularityCode === "1" ? "Reguler" : "Non-Reguler",
      entryYear: "20" + entryYear, // 200s assumtions
      semesterCode: semesterCode === "1" ? "Ganjil" : "Genap",
      registrationNumber: registrationNumber,
    }
  }

  // Parse NIP for get details information
  parseNip(nip: string): ParseNip | null {
    if (!nip || nip.length !== 18) return null;

    const birthDate = nip.substring(0, 8);
    const appointmentDate = nip.substring(8, 14);
    const serialNumber = nip.substring(14);
    // Date of brith format
    const birthYear = birthDate.substring(0, 4);
    const birthMonth = birthDate.substring(4, 6);
    const birthDay = birthDate.substring(6, 8);
    // Appointment date format
    const appointmentYear = appointmentDate.substring(0, 4);
    const appointmentMonth = appointmentDate.substring(4, 6);
    // Gender determination based on the third digit from the end of serial number
    // This is a common convention in some institutions but not a standardized rule
    const genderDigit = serialNumber.charAt(1); // Get the second digit of serial number
    const gender = this.determineGender(parseInt(genderDigit));

    return {
      nip: nip,
      birthDate: {
        full: `${birthYear}-${birthMonth}-${birthDay}`,
        year: birthYear,
        month: birthMonth,
        day: birthDay
      },
      appointmentDate: {
        full: `${appointmentYear}-${appointmentMonth}`,
        year: appointmentYear,
        month: appointmentMonth
      },
      serialNumber: serialNumber,
      gender
    }

  }

  // Alternative gender determination method using birth date
  determineGenderFromBirthday(birthDay: string): Gender {
    // In some systems, birth day is modified for females:
    // For females, 40 is added to the actual birth day
    const day = parseInt(birthDay);
    if (isNaN(day)) return "UNKNOWN";

    if (day > 40) {
      // If day > 40, it's likely a female with the actual day being (day - 40)
      return "FEMALE";
    } else if (day > 0 && day <= 31) {
      // Normal day range, likely male
      return "MALE";
    }
    return "UNKNOWN";
  }

  // Indentitiy validation
  validateIdentity(indentity: string): ValidationResult {
    if (this.nimRegex.test(indentity)) {
      return { valid: true, type: "NIM", details: this.parseNim(indentity) };
    } else if (this.nipRegex.test(indentity)) {
      return { valid: true, type: "NIP", details: this.parseNip(indentity) };
    } else {
      return { valid: false, type: "UNKNOWN", details: null };
    }
  }
}

// Cretae a singleton instace for easy import
export const identityExtractor = new IdentityExtractor();

// Helper function for simpler imports
export function validateAcademicIdentity(indentity: string) {
  return identityExtractor.validateIdentity(indentity.toLocaleUpperCase());
}


export const formDataToObject = (formData: FormData): Record<string, any> => {
  const result: Record<string, any> = {};
  
  // Iterate through all entries in FormData
  for (const [key, value] of formData.entries()) {
    // Preserve File objects directly without any transformation
    result[key] = value;
  }
  
  return result;
};