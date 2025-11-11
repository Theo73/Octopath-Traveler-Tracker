# 🧭 Octopath Traveler Tracker

A lightweight **local web tracker** designed for **Octopath Traveler 1**, helping players track every **treasure chest** and **boss** in the game for 100%, All success or randomizer.  
No server, no login — everything is saved **locally in your browser**.

---

## ✨ Features

- ✅ **Track all treasure chests** in each region and zone  
- 🗺️ Region → Zone selection for easy navigation  
- 📂 **CSV import/export** for adding or sharing chest lists  
- 💾 **Local autosave** (progress is saved automatically in your browser)  
- ⬆️ **Manual save export/import** for backups or sharing progress  
- ⚔️ **Boss tracker** for each of the 8 travelers + an “Extra” category for Super Bosses and Final Boss 
- 🖼️ Custom boss icons (stored locally)  
- 🕹️ Works fully **offline**

---

## 🗂️ CSV Format

The tracker uses a custom `|` separator to avoid issues with commas in descriptions.  
Each line follows this format:
Region|Zone|Chest Description

Example:
Cliftlands|Bolderfall|Right of the Inn

Coastlands|Grandport|Back of the Bazaar, left chest

Sunlands|Marsalim|Behind the throne inside the palace

Once imported, zones and regions are automatically created inside the tracker.

---

## ⚔️ Boss Tracker

Each traveler (Olberic, Tressa, Cyrus, Primrose, Ophilia, Alfyn, Therion, H’annit) has **4 boss icons**, and the **Extra** category has **5**.  

When clicked, icons toggle between grayed-out (not defeated) and bright (defeated).
Your boss progress is also stored locally.

💾 Saving & Loading Progress

Your progress is automatically stored using the browser’s localStorage.

You can also manually export/import your current state using the buttons:

Export Save → creates a .json file of your tracker state
Import Save → restores progress from a saved file

Since everything runs locally, you can simply:

Open tracker.html directly in your browser


```
/tracker
│
├── tracker.html      # Main page
├── style.css         # Octopath-inspired design
├── script.js         # Tracker logic (zones, bosses, saving)
├── /assets           # Local boss icon images
└── /data
    └── chests.csv    # Starting CSV
```


HTML5, CSS3, Vanilla JS
Uses LocalStorage for persistent progress
No frameworks, no dependencies — 100% standalone

Credits :

Developed by Theo73 alias ShIIro

Inspired by Octopath Traveler © Square Enix / Acquire

This project is fan-made and non-commercial
