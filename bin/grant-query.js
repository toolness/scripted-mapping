// We need to generate the following counts, from Sue Zachman:
//
// > Can you run a one time count for us please?
// > 
// > Of all schools in the expanded dataset that are within 30 mins
// > commuting distance from one of the origins and also a big enough
// > school to be reasonably feasible to post a full size scriptEd
// > class - say 100 students per grade? We'd like to use all three
// > numbers in a grant proposal this week. Ie total in data set,
// > then all that are commutable, than all commutable and big enough. 

var schools = require('./nyc-school-addresses');
var trips = require('./transit-times');

var originAddresses = Object.keys(trips);

function studentsPerGrade(school) {
  var students = school.students;
  var grades = school.grades;
  var minGrade = grades[0];
  var maxGrade = grades[1] || minGrade;
  var numGrades;

  if (!students) return 0;
  if (students.allGrades) {
    students = students.allGrades;
    numGrades = maxGrade - minGrade + 1;
  } else {
    numGrades = maxGrade - Math.max(minGrade, 9) + 1;
  }

  return students / numGrades;
}

function commuteTimeInMinutes(originAddress, school) {
  return trips[originAddress][school.address].duration / 60;
}

function main() {
  var commutableSchools, commutableBigSchools;

  console.log("Total schools:", schools.length);

  commutableSchools = schools.filter(function(school) {
    return originAddresses.some(function(originAddress) {
      return commuteTimeInMinutes(originAddress, school) <= 30;
    });
  });

  console.log("Commutable schools:", commutableSchools.length);

  commutableBigSchools = commutableSchools.filter(function(school) {
    return studentsPerGrade(school) >= 100;
  });

  console.log("Commutable big schools:", commutableBigSchools.length);
}

if (!module.parent)
  main();
