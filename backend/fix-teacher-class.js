const { Sequelize } = require("sequelize");
const User = require("./models/User");
const db = require("./utils/db");

async function fixTeacherClass() {
  try {
    // Find the teacher
    const teacher = await User.findOne({
      where: { fullName: "OLUMIDE FALUYI", role: "TEACHER" }
    });

    if (!teacher) {
      console.log("Teacher not found");
      process.exit(1);
    }

    console.log("Found teacher:", {
      id: teacher.id,
      fullName: teacher.fullName,
      isFormTeacher: teacher.isFormTeacher,
      assignedClass: teacher.assignedClass
    });

    // Assign a class (e.g., SSS 1)
    await teacher.update({
      isFormTeacher: true,
      assignedClass: "SSS 1"
    });

    console.log("Updated! Teacher now has class: SSS 1");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

fixTeacherClass();
