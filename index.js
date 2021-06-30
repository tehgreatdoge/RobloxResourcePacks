var prompt = require("prompt")
const fs = require("fs");
const path = require("path");

var UserPath = process.cwd().match(/(\\)([^\\]+\\[^\\]+)(\\)/m)[0];
var RobloxInstancesPath = `${UserPath}/AppData/Local/Roblox/Versions`;
let RobloxInstances = fs.readdirSync(RobloxInstancesPath)
RobloxInstances=RobloxInstances.filter(a => a.match(/version/gm)!==null)
console.log(RobloxInstances)
console.log("Found Roblox Instances\n")
console.log(`${RobloxInstances}\n`)
const getname = callback => {
    prompt.start()
    prompt.get(["name"], (err,result)=> {
        console.log(result.name)
        callback(result.name)
    })
}
if (!fs.existsSync("RobloxResourcePacks")) {
    fs.mkdirSync("RobloxResourcePacks")
}
var ResourcePacks = fs.readdirSync("ResourcePacks")
if (ResourcePacks.length == 0) {
    console.warn("no resouce packs installed")
}
else {
    getname((name) => {
        var FilePath = "RobloxResourcePacks/" + name
        console.log(`interpreted file path ${FilePath}`)
        if (!fs.existsSync(`${FilePath}/index.json`)) {
            console.log("Resource pack is missing or damaged")
        }
        else{
            console.log(`Successfuly found ${FilePath}/index.json\n`);
            console.log("-----Loading pack!-----")
            var json = JSON.parse(fs.readFileSync(`${FilePath}/index.json`))
            console.log(`name: ${json.name}\n`)
            console.log(`by: ${json.author}\n`)
            console.log(`description: ${json.description}\n`)
            RobloxInstances.forEach(instance => {
                json.mapping.forEach(element => {
                    fs.copyFileSync(path.join(FilePath,element[0]),path.join(path.join(path.join(RobloxInstancesPath,instance),element[1]),element[0]))
                })
            })
            
        }
    })    
}
