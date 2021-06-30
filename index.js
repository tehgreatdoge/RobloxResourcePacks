var prompt = require("prompt")
const fs = require("fs");
const path = require("path");

//load config file is there is one, otherwise, create one and set it to the default value.
if (!fs.existsSync("config.json")) {
    fs.writeFileSync("config.json",JSON.stringify({
        "robloxPath": path.join(process.cwd().match(/(\\)([^\\]+\\[^\\]+)(\\)/m)[0],"/AppData/Local/Roblox/") //That regex is to find the user home and probably isnt crossplatform
    }))
}
const config = JSON.parse(fs.readFileSync("config.json"))
let haserrors
if (!fs.existsSync(config.robloxPath)) {
    console.error("roblox path does not point to the roblox folder, change it in config.json")
    haserrors = true
}
const robloxVersionsPath = path.join(config.robloxPath,"/Versions")
if (!fs.existsSync("ResourcePacks")) {
    fs.mkdirSync("RobloxResourcePacks")
}
var ResourcePacks = fs.readdirSync("ResourcePacks")
if (ResourcePacks.length == 0) {
    console.warn("no resouce packs installed")
}
let RobloxInstances = fs.readdirSync(path.join(robloxVersionsPath))
RobloxInstances = RobloxInstances.filter(value => {
    if (value.match(/version/gm)!==null && fs.statSync(path.join(robloxVersionsPath,value)).isDirectory()) {
        return true
    }
    return false
})
console.log("Found Roblox Instances")
console.log(RobloxInstances)
//
const getname = callback => {
    prompt.start()
    prompt.get(["name"], (err,result)=> {
        console.log(result.name)
        callback(result.name)
    })
}
try {
    getname((name) => {
        var FilePath = "ResourcePacks/" + name
        console.log(`interpreted file path ${FilePath}`)
        if (!fs.existsSync(`${FilePath}/index.json`)) {
            console.log("Resource pack is missing or damaged")
        }
        else{
            console.log(`Successfuly found ${FilePath}/index.json\n`);
            console.log("-----Loading pack!-----")
            var json = JSON.parse(fs.readFileSync(`${FilePath}/index.json`))
            console.log(`name: ${json.name || "no name"}\n`)
            console.log(`by: ${json.author || "unknown"}\n`)
            console.log(`description: ${json.description || "no description"}\n`)
            RobloxInstances.forEach(instance => {
                json.mapping.forEach(element => {
                    fs.copyFileSync(path.join(FilePath,element[0]),path.join(path.join(path.join(robloxVersionsPath,instance),element[1]),element[0]))
                })
            })
            
        }
    })    
}
catch(err) {
    console.error(err)
}
