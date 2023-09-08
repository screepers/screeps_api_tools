export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getShardNames() {
    return ['shard0', 'shard1', 'shard2', 'shard3']
}