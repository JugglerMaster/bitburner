/** @param {NS} ns */
export async function main(ns) {
ns.tail();
    ;ns.disableLog('ALL');

    const maxNodes = 30;
    var moreUpgradesRemaining = true;

    // Buy first HacknetNode if there are none
    if (ns.hacknet.numNodes() === 0 & ns.getServerMoneyAvailable("home") >= 1000) {
        ns.hacknet.purchaseNode();
        ns.print('Purchased first Hacknet node!');
    }

    async function getNextNodeHasCheaperUpgrade(currentNodeIndex) {
        if (currentNodeIndex == ns.hacknet.numNodes()) {
            return false;
        }
        else {
            const nextNodeIndex = currentNodeIndex + 1
            const currentNodeLevelUpgradeCost = ns.hacknet.getLevelUpgradeCost(currentNodeIndex, 1);
            const currentNodeRamUpgradeCost = ns.hacknet.getRamUpgradeCost(currentNodeIndex, 1);
            const currentNodeCoreUpgradeCost = ns.hacknet.getCoreUpgradeCost(currentNodeIndex, 1);
            const currentNodeCheapestUpgrade = Math.min(currentNodeLevelUpgradeCost, currentNodeRamUpgradeCost, currentNodeCoreUpgradeCost);

            //if this is the last hacknet node, check the price of a new node
            if (nextNodeIndex === ns.hacknet.numNodes()) {
                if (ns.hacknet.numNodes() >= maxNodes) {
                    var nextNodeCheapestUpgrade = Infinity;
                }
                else {
                    var nextNodeCheapestUpgrade = ns.hacknet.getPurchaseNodeCost();
                }
            }
            //if this is not the last hacknet node, check the upgrade costs of the next node.
            else {
                const nextNodeLevelUpgradeCost = ns.hacknet.getLevelUpgradeCost(nextNodeIndex, 1);
                const nextNodeRamUpgradeCost = ns.hacknet.getRamUpgradeCost(nextNodeIndex, 1);
                const nextNodeCoreUpgradeCost = ns.hacknet.getCoreUpgradeCost(nextNodeIndex, 1);
                var nextNodeCheapestUpgrade = Math.min(nextNodeLevelUpgradeCost, nextNodeRamUpgradeCost, nextNodeCoreUpgradeCost);
            }

            return (currentNodeCheapestUpgrade >= nextNodeCheapestUpgrade);
        }
    }

    async function getCheapestNode() {
        var cheapestNodeIndex = 0;
        while (await getNextNodeHasCheaperUpgrade(cheapestNodeIndex)) {
            cheapestNodeIndex++;
        }
        return cheapestNodeIndex;
    }

    async function getCheapestUpgrade(targetNodeIndex) {
        if (targetNodeIndex === ns.hacknet.numNodes()) {
            var cheapestUpgradeCost = ns.hacknet.getPurchaseNodeCost();
            return {
                Upgrade: 'New',
                Cost: cheapestUpgradeCost
            }
        }
        else {
            var LevelUpgradeCost = ns.hacknet.getLevelUpgradeCost(targetNodeIndex, 1);
            var RamUpgradeCost = ns.hacknet.getRamUpgradeCost(targetNodeIndex, 1);
            var CoreUpgradeCost = ns.hacknet.getCoreUpgradeCost(targetNodeIndex, 1);
            var cheapestUpgradeCost = Math.min(LevelUpgradeCost, RamUpgradeCost, CoreUpgradeCost);
            if (LevelUpgradeCost === cheapestUpgradeCost) {
                return {
                    Upgrade: 'Level',
                    Cost: LevelUpgradeCost
                }
            }
            if (RamUpgradeCost === cheapestUpgradeCost) {
                return {
                    Upgrade: 'Ram',
                    Cost: RamUpgradeCost
                }
            }
            if (CoreUpgradeCost === cheapestUpgradeCost) {
                return {
                    Upgrade: 'Core',
                    Cost: CoreUpgradeCost
                }
            }
        }
    }

    //main loop
    while (moreUpgradesRemaining) {
        // find the node with the cheapest upgrade.
        var i = await getCheapestNode();

        if (i < maxNodes) {
            // find the cheapest upgrade on the target
            var cheapestUpgrade = await getCheapestUpgrade(i);

            ns.print('Cheapest Upgrade is ' + cheapestUpgrade.Upgrade + ' for hacknet-node-' + i);

            // wait until we have enough money to do the upgrade.
            var playerMoney = ns.getServerMoneyAvailable('home');

            while (playerMoney < cheapestUpgrade.Cost) {
                ns.print('Not enough money to upgrade hacknet-node-' + i);
                await ns.sleep(60000)
                var playerMoney = ns.getServerMoneyAvailable('home');
            }

            // do the upgrade
            switch (cheapestUpgrade.Upgrade) {
                case 'Level':
                    ns.hacknet.upgradeLevel(i, 1);
                    break;
                case 'Ram':
                    ns.hacknet.upgradeRam(i, 1);
                    break;
                case 'Core':
                    ns.hacknet.upgradeCore(i, 1);
                    break;
                case 'New':
                    ns.hacknet.purchaseNode();
                    break;
            }
        }
        else {
            ns.print('Max number of nodes reached and no upgrades remaining.')
            var moreUpgradesRemaining = false;
        }
        await ns.sleep(100);
    }
}
