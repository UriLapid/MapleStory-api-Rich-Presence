const fetch = require("node-fetch");
const express = require("express");
const DiscordRPC = require('discord-rpc');
const app = express();

app.get("/api/character/:region/:ign", async (req, res) => {
    let region = "";
    if (req.params.region == "gms") {
        region = "";
    } else if (req.params.region == "ems") {
        region = "region=eu&";
    }
    const char = await fetch(`https://maplestory.nexon.net/api/ranking?id=overall&id2=legendary&${region}rebootIndex=0&character_name=${req.params.ign}&page_index=1`);
    const info = await char.json();
    res.json(info[0]);
});

const characterInfo = async () => {
    const info = await fetch("https://maplestory.nexon.net/api/ranking?id=overall&id2=legendary&rebootIndex=0&character_name=OriannaTorch&page_index=1");
    return await info.json();
};

const clientId = "1043159742052319293";
const RPC = new DiscordRPC.Client({ transport: 'ipc'});
DiscordRPC.register(clientId);

async function setActivity() {
    if (!RPC) return;
    const info = await characterInfo();
    console.log(info);
    RPC.setActivity({
        details: `IGN: ${info[0].CharacterName}`,
        state: `Class: ${info[0].JobName}`,
        largeImageKey: `orianna-torch`,
        largeImageText: `${info[0].WorldName}`,
        instance: false
    });
};

RPC.on('ready', async () => {
    setActivity();
});

RPC.login({ clientId }).catch(err => console.error(err));

app.listen(8000);