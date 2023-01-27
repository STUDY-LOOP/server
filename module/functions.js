exports.toPublicId = function(groupName, groupId){
    const gpid = groupId.substr(0, 7);
    return `${groupName}=${gpid}`
}