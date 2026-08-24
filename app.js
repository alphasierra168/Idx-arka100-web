async function loadArkaData() {
    try {
        const response = await fetch("daily_report.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Gagal membaca daily_report.json");
        }

        const data = await response.json();

        updateDashboard(data);

    } catch (error) {
        console.error("ARKA DATA ERROR:", error);
    }
}


function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(value);
}


function formatPercent(value) {
    if (value === null || value === undefined) {
        return "—";
    }

    const sign = value > 0 ? "+" : "";

    return `${sign}${value.toFixed(2)}%`;
}


function updateDashboard(data) {

    const challenge = data.challenge;
    const account = data.account;
    const performance = data.performance;
    const market = data.market;
    const today = data.today;
    const journal = data.journal;

    /* PROGRESS */

    const progress = (challenge.day / challenge.total_days) * 100;

    document.querySelector(".progress-top strong").innerHTML =
        `DAY ${String(challenge.day).padStart(2, "0")} <small>/ ${challenge.total_days}</small>`;

    document.querySelector(".progress-percent").textContent =
        `${progress.toFixed(0)}%`;

    document.querySelector(".progress-bar div").style.width =
        `${progress}%`;

    document.querySelector(".progress-info span:first-child").textContent =
        `Day ${challenge.day} of ${challenge.total_days}`;

    document.querySelector(".progress-info span:last-child").textContent =
        `Remaining: ${challenge.total_days - challenge.day} days`;


    /* ACCOUNT */

    const statCards = document.querySelectorAll(".stat-card");

    statCards[0].querySelector("strong").textContent =
        formatRupiah(account.starting_capital);

    statCards[1].querySelector("strong").textContent =
        formatRupiah(account.equity);

    statCards[2].querySelector("strong").textContent =
        formatPercent(account.return_pct);

    statCards[3].querySelector("strong").textContent =
        performance.total_trades;


    /* MARKET */

    const marketCards = document.querySelectorAll(".market-card");

    marketCards[0].querySelector("strong").textContent =
        formatPercent(account.return_pct);

    marketCards[1].querySelector("strong").textContent =
        formatPercent(market.ihsg_return_pct);

    marketCards[2].querySelector("strong").textContent =
        formatPercent(market.lq45_return_pct);


    /* TODAY */

    document.querySelector(".today-card h3").textContent =
        `Day ${challenge.day}: ${today.daily_return_pct >= 0 ? "ARKA tetap berjalan." : "Hari yang berat untuk ARKA."}`;

    document.querySelector(".today-card p").textContent =
        today.summary;


    /* JOURNAL */

    document.querySelector(".journal-date").textContent =
        `DAY ${String(challenge.day).padStart(2, "0")}`;

    document.querySelector(".journal h3").textContent =
        journal.title;

    const journalParagraphs =
        document.querySelectorAll(".journal p");

    if (journalParagraphs.length > 0) {
        journalParagraphs[0].textContent =
            journal.content;
    }


    /* TRADE TABLE */

    const tbody = document.querySelector("tbody");

    if (!data.trades || data.trades.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    Belum ada trade.
                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML = data.trades.map(trade => `
        <tr>
            <td>${trade.id}</td>
            <td><strong>${trade.ticker}</strong></td>
            <td>${trade.setup || "—"}</td>
            <td>${trade.entry ?? "—"}</td>
            <td>${trade.target ?? "—"}</td>
            <td>${trade.stop_loss ?? "—"}</td>
            <td>${trade.status || "—"}</td>
        </tr>
    `).join("");
}


loadArkaData();
