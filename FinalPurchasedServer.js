/** @param {NS} ns **/export async function main(ns) {
    ns.tail();

    while(true){
            try{
    ns.killall('xHx-1-0');
    ns.deleteServer('xHx-1-0');
    }catch{}
        try{
            var ram = (ns.getServerMaxRam('xHx-24')*2);ns.print(ram,);
        }catch{
            var ram = 4;
        }
        
        var i = 0;
        while (i < ns.getPurchasedServerLimit()){
            while (ns.getServerMoneyAvailable('home') < ns.getPurchasedServerCost(ram)){
                await ns.sleep(8192);
                }
                {
                    try{
                    ns.killall('xHx-' + i);
                    ns.deleteServer('xHx-' + i);
                    var hostname = ns.purchaseServer('xHx-' + i, ram);
                    await ns.scp('bang-bang-shoot-em-up.js', hostname);
                    ns.exec('bang-bang-shoot-em-up.js', hostname, (ram/2.4));
                    ++i;
                    }catch{
                    var hostname = ns.purchaseServer('xHx-' + i, ram);
                    await ns.scp('bang-bang-shoot-em-up.js', hostname);
                    ns.exec('bang-bang-shoot-em-up.js', hostname, (ram/2.4));
                    ++i;    
                    }
                    await ns.sleep(8192);
                    }
                    }
                    await ns.sleep(8192);
                    }
                    }
