const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Result = require("../models/Result");

const getAssignedSubjectNames = (assignedSubject) =>
  (Array.isArray(assignedSubject)
    ? assignedSubject
    : String(assignedSubject || "").split(","))
    .map((name) => name.trim().toLocaleLowerCase())
    .filter(Boolean);

/**
 * Keep teacher result changes within the student's registered subjects.
 * Subject-only teachers are additionally limited to their assigned subject(s).
 * Admin and form-teacher workflows remain supported.
 */
const authorizeResultEnrollment = async (req, res, next) => {
  if (req.user?.role !== "TEACHER") return next();

  try {
    let studentId;
    let subjectId;

    if (req.method === "POST") {
      ({ studentId, subjectId } = req.body || {});
    } else {
      const result = await Result.findByPk(req.params.id);
      if (!result) return res.status(404).send({ error: "Result not found" });
      studentId = result.StudentId;
      subjectId = result.SubjectId;
    }

    if (!studentId || !subjectId) {
      return res.status(400).send({ error: "Student and subject are required" });
    }

    const [student, subject] = await Promise.all([
      Student.findOne({ where: { id: studentId, isActive: true } }),
      Subject.findByPk(subjectId),
    ]);

    if (!student || !subject) {
      return res.status(404).send({ error: "Active student or subject not found" });
    }

    const enrolledSubjects = await student.getSubjects({
      where: { id: subject.id },
      attributes: ["id"],
      joinTableAttributes: [],
    });
    if (!enrolledSubjects.length) {
      return res.status(403).send({
        error: "Cannot record or change a result for a subject the student is not registered for",
      });
    }

    // A subject-only teacher may only enter or manage results for their assignment.
    // Form teachers can still enter results for their class, but only for subjects
    // each student is actually registered to take.
    if (req.user.isSubjectTeacher && !req.user.isFormTeacher) {
      const assignedSubjects = getAssignedSubjectNames(req.user.assignedSubject);
      if (!assignedSubjects.includes(subject.name.trim().toLocaleLowerCase())) {
        return res.status(403).send({
          error: "You are not assigned to enter results for this subject",
        });
      }
    }

    return next();
  } catch (error) {
    console.error("Result enrollment authorization error:", error);
    return res.status(500).send({ error: "Could not verify student subject registration" });
  }
};

module.exports = authorizeResultEnrollment;
