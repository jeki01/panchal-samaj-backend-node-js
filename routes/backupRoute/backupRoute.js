// backup.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();
const router = express.Router();

// 🔹 Backup route
router.get("/backup", async (req, res) => {
    try {
        // 1. Fetch data from all Prisma models
        const users = await prisma.user.findMany();
        const villages = await prisma.village.findMany();
        const families = await prisma.family.findMany();
        const persons = await prisma.person.findMany();
        const chakola = await prisma.chakola.findMany();

        // 2. Create Excel workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(users), "Users");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(villages), "Villages");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(families), "Families");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(persons), "Persons");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(chakola), "Chakola");

        // 3. Ensure backup folder exists
        const backupDir = path.join(__dirname, "backup");
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // 4. Generate filename with timestamp
        const fileName = `backup_${new Date().toISOString().replace(/[:.]/g, "-")}.xlsx`;
        const filePath = path.join(backupDir, fileName);

        // 5. Write Excel file to file system
        XLSX.writeFile(wb, filePath);

        // 6. Send response
        res.json({
            success: true,
            message: "Backup created successfully",
            file: fileName,
            path: filePath
        });
    } catch (err) {
        console.error("❌ Backup error:", err);
        res.status(500).json({ error: "Backup failed" });
    } finally {
        await prisma.$disconnect();
    }
});

module.exports = router;
