// ========================================
// DATA
// ========================================

let flights = [
    {
        flight: "TG101",
        type: "Departure",
        origin: "BKK",
        destination: "SIN",
        time: "18:40",
        gate: "A3",
        stand: "P12",
        belt: "B4",
        status: "Boarding"
    },
    {
        flight: "FD320",
        type: "Departure",
        origin: "BKK",
        destination: "HKT",
        time: "18:55",
        gate: "B7",
        stand: "P10",
        belt: "B2",
        status: "On Time"
    },
    {
        flight: "SQ708",
        type: "Arrival",
        origin: "SIN",
        destination: "BKK",
        time: "19:10",
        gate: "A5",
        stand: "P14",
        belt: "B3",
        status: "Landed"
    },
    {
        flight: "AK882",
        type: "Arrival",
        origin: "KUL",
        destination: "BKK",
        time: "19:25",
        gate: "A6",
        stand: "P11",
        belt: "B5",
        status: "On Time"
    },
    {
        flight: "TG206",
        type: "Departure",
        origin: "BKK",
        destination: "NRT",
        time: "19:40",
        gate: "C2",
        stand: "P13",
        belt: "B1",
        status: "Delayed"
    }
];


let alerts = [
    {
        type: "warning",
        title: "TG101 ล่าช้า 15 นาที",
        detail: "สาเหตุ: สภาพอากาศ",
        time: "18:20"
    },
    {
        type: "info",
        title: "Baggage Belt B3 Maintenance",
        detail: "ประมาณ 30 นาที",
        time: "17:50"
    },
    {
        type: "danger",
        title: "Gate Change: TG206",
        detail: "เปลี่ยนจาก Gate C4 → C2",
        time: "17:30"
    }
];


const baggageData = {
    BG1001: {
        passenger: "Somchai P.",
        flight: "TG101",
        belt: "B4",
        status: "Loaded on Aircraft",
        steps: [
            ["Check-in Completed", "17:20"],
            ["Security Screening", "17:32"],
            ["Sorting Area", "17:48"],
            ["Loaded on Aircraft", "18:10"]
        ]
    },

    BG1002: {
        passenger: "Nattapong K.",
        flight: "FD320",
        belt: "B2",
        status: "Sorting Area",
        steps: [
            ["Check-in Completed", "17:35"],
            ["Security Screening", "17:50"],
            ["Sorting Area", "18:05"]
        ]
    },

    BG1003: {
        passenger: "Anna Lee",
        flight: "SQ708",
        belt: "B3",
        status: "Baggage Claim",
        steps: [
            ["Aircraft Arrived", "18:42"],
            ["Unloaded from Aircraft", "18:55"],
            ["Transfer to Baggage Belt", "19:05"],
            ["Baggage Claim", "19:12"]
        ]
    }
};


let selectedFlightIndex = null;


// ========================================
// PAGE NAVIGATION
// ========================================

const pageInfo = {
    dashboard: [
        "Airport Operations",
        "ศูนย์ควบคุมการปฏิบัติการสนามบิน"
    ],

    flights: [
        "Flight Management",
        "จัดการและติดตามเที่ยวบิน"
    ],

    resources: [
        "Resource Allocation",
        "จัดสรรทรัพยากรสนามบิน"
    ],

    ground: [
        "Ground Services",
        "ติดตามบริการภาคพื้น"
    ],

    baggage: [
        "Baggage Tracking",
        "ติดตามสถานะสัมภาระ"
    ],

    staff: [
        "Staff & Equipment",
        "จัดการบุคลากรและอุปกรณ์"
    ],

    alerts: [
        "Incidents & Alerts",
        "ติดตามเหตุการณ์และการแจ้งเตือน"
    ],

    reports: [
        "Reports & Analytics",
        "รายงานและวิเคราะห์ประสิทธิภาพ"
    ]
};


document.querySelectorAll(".nav-item").forEach(button => {

    button.addEventListener("click", () => {

        openPage(button.dataset.page);

    });

});


function openPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");


    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");

        if (item.dataset.page === pageId) {
            item.classList.add("active");
        }
    });


    document.getElementById("pageTitle").textContent =
        pageInfo[pageId][0];

    document.getElementById("pageSubtitle").textContent =
        pageInfo[pageId][1];


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ========================================
// DATE / TIME
// ========================================

function updateClock() {

    const now = new Date();

    document.getElementById("currentTime").textContent =
        now.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

    document.getElementById("currentDate").textContent =
        now.toLocaleDateString("th-TH", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

updateClock();

setInterval(updateClock, 1000);


// ========================================
// STATUS
// ========================================

function statusClass(status) {

    switch (status) {

        case "On Time":
            return "on-time";

        case "Boarding":
            return "boarding";

        case "Delayed":
            return "delayed";

        case "Landed":
            return "landed";

        default:
            return "on-time";
    }
}


// ========================================
// DASHBOARD FLIGHTS
// ========================================

function renderDashboardFlights() {

    const table =
        document.getElementById("dashboardFlightTable");

    table.innerHTML = "";

    flights.slice(0, 5).forEach(flight => {

        table.innerHTML += `
            <tr>
                <td class="flight-number">
                    ${flight.flight}
                </td>

                <td>
                    ${flight.origin} → ${flight.destination}
                </td>

                <td>
                    ${flight.time}
                </td>

                <td>
                    ${flight.gate}
                </td>

                <td>
                    <span class="status ${statusClass(flight.status)}">
                        ${flight.status}
                    </span>
                </td>
            </tr>
        `;

    });

}


// ========================================
// FLIGHT TABLE
// ========================================

function renderFlights() {

    const table =
        document.getElementById("flightTable");

    const search =
        document.getElementById("flightSearch").value.toLowerCase();

    const filter =
        document.getElementById("flightFilter").value;

    table.innerHTML = "";


    flights.forEach((flight, index) => {

        const searchable =
            `${flight.flight} ${flight.origin} ${flight.destination}`
                .toLowerCase();


        if (!searchable.includes(search)) {
            return;
        }

        if (
            filter !== "all" &&
            flight.status !== filter
        ) {
            return;
        }


        table.innerHTML += `
            <tr>

                <td class="flight-number">
                    ${flight.flight}
                </td>

                <td>
                    ${flight.type}
                </td>

                <td>
                    ${flight.origin} → ${flight.destination}
                </td>

                <td>
                    ${flight.time}
                </td>

                <td>
                    ${flight.gate}
                </td>

                <td>
                    <span class="status ${statusClass(flight.status)}">
                        ${flight.status}
                    </span>
                </td>

                <td>
                    <button
                        class="action-btn"
                        onclick="changeFlightStatus(${index})">
                        Update Status
                    </button>
                </td>

            </tr>
        `;

    });

}


document
    .getElementById("flightSearch")
    .addEventListener("input", renderFlights);


document
    .getElementById("flightFilter")
    .addEventListener("change", renderFlights);


// ========================================
// GLOBAL SEARCH
// ========================================

document
    .getElementById("globalSearch")
    .addEventListener("input", function () {

        const value = this.value.trim();

        if (value.length > 0) {

            openPage("flights");

            document.getElementById("flightSearch").value =
                value;

            renderFlights();
        }

    });


// ========================================
// FLIGHT STATUS
// ========================================

function changeFlightStatus(index) {

    const statuses = [
        "On Time",
        "Boarding",
        "Delayed",
        "Landed"
    ];

    const current =
        statuses.indexOf(flights[index].status);

    flights[index].status =
        statuses[(current + 1) % statuses.length];

    renderFlights();
    renderDashboardFlights();

    showToast(
        `${flights[index].flight} เปลี่ยนสถานะเป็น ${flights[index].status}`
    );
}


// ========================================
// ADD FLIGHT
// ========================================

function openFlightModal() {

    document
        .getElementById("flightModal")
        .classList.add("show");
}


function closeFlightModal() {

    document
        .getElementById("flightModal")
        .classList.remove("show");
}


function addFlight() {

    const flight =
        document.getElementById("newFlightNumber")
            .value.trim()
            .toUpperCase();

    const type =
        document.getElementById("newFlightType").value;

    const origin =
        document.getElementById("newOrigin")
            .value.trim()
            .toUpperCase();

    const destination =
        document.getElementById("newDestination")
            .value.trim()
            .toUpperCase();

    const time =
        document.getElementById("newTime").value;

    const gate =
        document.getElementById("newGate")
            .value.trim()
            .toUpperCase();


    if (
        !flight ||
        !origin ||
        !destination ||
        !time ||
        !gate
    ) {

        showToast("กรุณากรอกข้อมูลให้ครบ");

        return;
    }


    flights.push({
        flight,
        type,
        origin,
        destination,
        time,
        gate,
        stand: "Not Assigned",
        belt: "Not Assigned",
        status: "On Time"
    });


    renderFlights();
    renderDashboardFlights();
    renderResources();
    renderGroundServices();

    closeFlightModal();

    showToast(`เพิ่มเที่ยวบิน ${flight} สำเร็จ`);


    document.getElementById("newFlightNumber").value = "";
    document.getElementById("newOrigin").value = "";
    document.getElementById("newDestination").value = "";
    document.getElementById("newTime").value = "";
    document.getElementById("newGate").value = "";
}


// ========================================
// RESOURCES
// ========================================

function renderResources() {

    const table =
        document.getElementById("resourceTable");

    table.innerHTML = "";


    flights.forEach((flight, index) => {

        table.innerHTML += `
            <tr>

                <td class="flight-number">
                    ${flight.flight}
                </td>

                <td>
                    ${flight.gate}
                </td>

                <td>
                    ${flight.stand}
                </td>

                <td>
                    ${flight.belt}
                </td>

                <td>
                    <button
                        class="action-btn"
                        onclick="openResourceModal(${index})">
                        Assign
                    </button>
                </td>

            </tr>
        `;

    });

}


function openResourceModal(index) {

    selectedFlightIndex = index;

    const flight =
        flights[index];

    document.getElementById(
        "assignFlightName"
    ).textContent =
        `${flight.flight} • ${flight.origin} → ${flight.destination}`;


    document
        .getElementById("resourceModal")
        .classList.add("show");
}


function closeResourceModal() {

    document
        .getElementById("resourceModal")
        .classList.remove("show");
}


function saveResource() {

    if (selectedFlightIndex === null) {
        return;
    }


    const flight =
        flights[selectedFlightIndex];


    flight.gate =
        document.getElementById("assignGate").value;

    flight.stand =
        document.getElementById("assignStand").value;

    flight.belt =
        document.getElementById("assignBelt").value;


    renderResources();
    renderFlights();
    renderDashboardFlights();

    closeResourceModal();


    showToast(
        `จัดสรรทรัพยากรให้ ${flight.flight} สำเร็จ`
    );
}


// ========================================
// GROUND SERVICES
// ========================================

function renderGroundServices() {

    const container =
        document.getElementById("groundCards");

    container.innerHTML = "";


    flights.slice(0, 4).forEach((flight, index) => {

        const cleaning =
            index === 0 ? 100 : 70 + index * 5;

        const baggage =
            index === 0 ? 85 : 55 + index * 8;

        const fuel =
            index === 0 ? 70 : 60 + index * 5;


        container.innerHTML += `

            <div class="ground-card">

                <div class="ground-flight">

                    <div>
                        <h3>${flight.flight}</h3>
                        <small>
                            ${flight.origin} → ${flight.destination}
                        </small>
                    </div>

                    <span class="status ${statusClass(flight.status)}">
                        ${flight.status}
                    </span>

                </div>


                ${serviceHTML(
                    "Aircraft Cleaning",
                    cleaning
                )}

                ${serviceHTML(
                    "Baggage Handling",
                    baggage
                )}

                ${serviceHTML(
                    "Refueling",
                    fuel
                )}

                ${serviceHTML(
                    "Catering",
                    65 + index * 5
                )}

            </div>
        `;

    });

}


function serviceHTML(name, value) {

    return `
        <div class="service-row">

            <span>${name}</span>

            <div class="progress">
                <div style="width:${value}%"></div>
            </div>

            <strong>${value}%</strong>

        </div>
    `;
}


// ========================================
// BAGGAGE TRACKING
// ========================================

function trackBaggage() {

    const tag =
        document.getElementById("baggageInput")
            .value.trim()
            .toUpperCase();

    const result =
        document.getElementById("baggageResult");

    const data =
        baggageData[tag];


    if (!data) {

        result.innerHTML = `
            <div class="baggage-result">

                <h3>ไม่พบข้อมูลสัมภาระ</h3>

                <p>
                    กรุณาตรวจสอบหมายเลข Baggage Tag อีกครั้ง
                </p>

            </div>
        `;

        return;
    }


    let timeline = "";


    data.steps.forEach(step => {

        timeline += `
            <div class="timeline-item">

                <strong>
                    ${step[0]}
                </strong>

                <p>
                    ${step[1]}
                </p>

            </div>
        `;

    });


    result.innerHTML = `

        <div class="baggage-result">

            <div class="section-heading">

                <div>
                    <h2>${tag}</h2>
                    <p>
                        Passenger: ${data.passenger}
                    </p>
                </div>

                <span class="status boarding">
                    ${data.status}
                </span>

            </div>


            <p>
                <strong>Flight:</strong>
                ${data.flight}
            </p>

            <p>
                <strong>Baggage Belt:</strong>
                ${data.belt}
            </p>


            <div class="timeline">
                ${timeline}
            </div>

        </div>
    `;

}


// ========================================
// ALERTS
// ========================================

function renderAlerts() {

    const dashboard =
        document.getElementById("dashboardAlerts");

    const list =
        document.getElementById("alertList");


    dashboard.innerHTML = "";
    list.innerHTML = "";


    alerts.forEach(alert => {

        let icon = "fa-circle-info";

        if (alert.type === "warning") {
            icon = "fa-triangle-exclamation";
        }

        if (alert.type === "danger") {
            icon = "fa-circle-exclamation";
        }


        dashboard.innerHTML += `

            <div class="alert-item">

                <div class="alert-icon ${alert.type}">
                    <i class="fa-solid ${icon}"></i>
                </div>

                <div>
                    <strong>
                        ${alert.title}
                    </strong>

                    <p>
                        ${alert.detail} • ${alert.time}
                    </p>
                </div>

            </div>
        `;


        list.innerHTML += `

            <div class="alert-page-card">

                <div>

                    <span class="status ${
                        alert.type === "danger"
                            ? "delayed"
                            : "on-time"
                    }">
                        ${alert.type.toUpperCase()}
                    </span>

                    <h3 style="margin-top:10px">
                        ${alert.title}
                    </h3>

                    <p>
                        ${alert.detail}
                    </p>

                </div>

                <strong>
                    ${alert.time}
                </strong>

            </div>
        `;

    });


    document.getElementById(
        "notificationCount"
    ).textContent = alerts.length;
}


function createAlert() {

    const title =
        prompt("ชื่อเหตุการณ์ / Alert:");

    if (!title) {
        return;
    }


    const detail =
        prompt("รายละเอียดเหตุการณ์:") ||
        "No additional information";


    const now =
        new Date().toLocaleTimeString(
            "th-TH",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    alerts.unshift({
        type: "warning",
        title,
        detail,
        time: now
    });


    renderAlerts();

    showToast("สร้าง Alert สำเร็จ");
}


// ========================================
// TOAST
// ========================================

function showToast(message) {

    const toast =
        document.getElementById("toast");

    document.getElementById(
        "toastMessage"
    ).textContent = message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


// ========================================
// CLOSE MODAL BY CLICKING BACKDROP
// ========================================

window.addEventListener("click", event => {

    const flightModal =
        document.getElementById("flightModal");

    const resourceModal =
        document.getElementById("resourceModal");


    if (event.target === flightModal) {
        closeFlightModal();
    }

    if (event.target === resourceModal) {
        closeResourceModal();
    }

});


// ========================================
// INITIAL RENDER
// ========================================

renderDashboardFlights();

renderFlights();

renderResources();

renderGroundServices();

renderAlerts();