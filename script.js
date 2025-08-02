const userInput = document.getElementById("date");
const manualInput = document.getElementById("manualInput");
const result = document.getElementById("result");
const modeDateBtn = document.getElementById("modeDate");
const modeManualBtn = document.getElementById("modeManual");
const dateMode = document.getElementById("dateMode");
const manualMode = document.getElementById("manualMode");

userInput.max = new Date().toISOString().split("T")[0];

let currentMode = "date";

function switchMode(mode) {
    currentMode = mode;

    if (mode === "date") {
        modeDateBtn.classList.add("active");
        modeManualBtn.classList.remove("active");
        dateMode.classList.remove("hidden");
        manualMode.classList.add("hidden");
    } else {
        modeManualBtn.classList.add("active");
        modeDateBtn.classList.remove("active");
        manualMode.classList.remove("hidden");
        dateMode.classList.add("hidden");
    }

    result.innerHTML = "";
}

function calculate() {
    if (currentMode === "date") {
        calculateFromDate(userInput.value);
    } else {
        const parsedDate = parseManualDate(manualInput.value);
        if (!parsedDate) {
            result.innerHTML = "⚠️ Please enter a valid birthdate (e.g., 10/03/1999).";
            return;
        }
        calculateFromDate(parsedDate.toISOString().split("T")[0]);
    }
}

function parseManualDate(input) {
    input = input.trim();
    const regex1 = /^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/; // dd/mm/yyyy
    const regex2 = /^(\d{4})[\/\-](\d{2})[\/\-](\d{2})$/; // yyyy-mm-dd

    let parts;
    if ((parts = input.match(regex1))) {
        return new Date(`${parts[3]}-${parts[2]}-${parts[1]}`);
    } else if ((parts = input.match(regex2))) {
        return new Date(`${parts[1]}-${parts[2]}-${parts[3]}`);
    }
    return null;
}

function calculateFromDate(dateStr) {
    const birthDate = new Date(dateStr);
    const today = new Date();

    if (!dateStr || birthDate > today) {
        result.innerHTML = "⚠️ Please enter a valid past date.";
        return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    const year = birthDate.getFullYear();

    showResults(years, months, days, month, day, year, totalDays);
}

function showResults(years, months, days, month, day, year, totalDays) {
    const birthstone = getBirthstone(month);
    const zodiac = getZodiac(month, day);
    const chineseZodiac = getChineseZodiac(year);

    result.innerHTML = `
    🧮 <strong>Exact Age:</strong> ${years} years, ${months} months, ${days} days<br>
    📆 <strong>Total days lived:</strong> ${totalDays} days<br>
    💎 <strong>Birthstone:</strong> ${birthstone}<br>
    ♈ <strong>Zodiac Sign:</strong> ${zodiac}<br>
    🐉 <strong>Chinese Zodiac:</strong> ${chineseZodiac}
  `;
}

function getBirthstone(month) {
    const stones = [
        "", "Garnet", "Amethyst", "Aquamarine", "Diamond", "Emerald",
        "Alexandrite", "Ruby", "Peridot", "Sapphire", "Opal", "Topaz", "Turquoise"
    ];
    return stones[month];
}

function getZodiac(month, day) {
    const signs = [
        ["Capricorn", 19], ["Aquarius", 18], ["Pisces", 20],
        ["Aries", 19], ["Taurus", 20], ["Gemini", 20],
        ["Cancer", 22], ["Leo", 22], ["Virgo", 22],
        ["Libra", 22], ["Scorpio", 21], ["Sagittarius", 21], ["Capricorn", 31]
    ];
    return day > signs[month - 1][1] ? signs[month][0] : signs[month - 1][0];
}

function getChineseZodiac(year) {
    const animals = [
        "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
        "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"
    ];
    return animals[year % 12];
}
[manualInput, userInput].forEach(input => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            calculate();
        }
    });
});