import Agenda from "agenda";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

let agenda;

export const initAgenda = async () => {
    if (agenda) return agenda;

    agenda = new Agenda({
        db: { address: process.env.ONLN_DBURL, collection: "agendajobs" },
        processEvery: `2 seconds`,
    });

    await agenda.start();
    console.log("✅ Agenda started and processing every 2 seconds");

    return agenda;
};

