 
 
const getQueryStringFromObj = (obj)=> {
  var str = "";
  for (var key in obj) {
    if (obj[key]) {
      if (str != "") {
        str += "&";
      }
      str += key + "=" + obj[key];
    }
  }
  return str;
}; 

function removeUnusedFields(obj){
  // Use Object.entries to get an array of [key, value] pairs
  const filteredEntries = Object.entries(obj).filter(([key, value]) => {
    // Filter out null, undefined, and empty string values
    return value !== null && value !== undefined;
  });

  // Use Object.fromEntries to convert the filtered array back to an object
  const filteredObj = Object.fromEntries(filteredEntries);

  return filteredObj;
}

const removeUnusedArray = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const cleanedObj = removeUnusedFields(value);
      if (Object.keys(cleanedObj).length > 0) {
        acc[key] = cleanedObj;
      }
    } else if (Array.isArray(value)) {
      if (value.length > 0) {
        acc[key] = value;
      }
    } else if (value !== null && value !== undefined && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {} );
};

function getResponse(data) {
  const reqData = errorCodes.errorCodes.find(
    (element) => element.code == data.message
  );
  if (!reqData) {
    const originalMsg = data?.message?.toString();
    const msg = originalMsg.split(":");
    if (msg.length > 1) {
      return msg[1];
    } else {
      return originalMsg;
    }
  }

  return reqData?.message;
}

function getPermission(
  permissionData,
  permissionString
) {
  if (permissionData?.length == 0 || !permissionString) {
    return false;
  }
  const permissionSet = permissionString?.split(".");
  let group = "";
  let moduleCode = "";
  let permission = "";
  if (permissionSet.length == 1) {
    group = permissionSet[0];
  } else if (permissionSet.length == 2) {
    group = permissionSet[0];
    permission = permissionSet[1];
  } else if (permissionSet.length == 3) {
    group = permissionSet[0];
    moduleCode = permissionSet[1];
    permission = permissionSet[2];
  }

  if (!Array.isArray(permissionData)) {
    return false;
  }
  const groupData =
    permissionData && permissionData?.find((g) => g?.group == group);
  if (!groupData) return undefined;

  if (!moduleCode) {
    // Group-level permission

    return groupData.permissions[permission ];
  }

  const moduleData = groupData.modules.find((m) => m.code === moduleCode);
  if (!moduleData) return undefined;

  if (!permission) {
    // Module-level permission
    return moduleData.permissions.view;
  }

  // Specific permission within the module
  return moduleData.permissions[permission ];
}

const preventStringHandler = (event, setValue, name) => {
  const requiredValue = event.target.value.replace(/\D/g, "");
  // Update the input value
  event.target.value = requiredValue;
  setValue(name, requiredValue);
};

const preventNumericHandler = (event, setValue, name) => {
  const requiredValue = event.target.value.replace(/[0-9]/g, "");
  // Update the input value
  event.target.value = requiredValue;
  setValue(name, requiredValue);
};
const preventSpecialCharHandler = (event, setValue, name) => {
  const requiredValue = event.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
  // Update the input value
  event.target.value = requiredValue;
  setValue(name, requiredValue);
};

export const commonService = {
  getQueryStringFromObj,
  removeUnusedFields,
  removeUnusedArray,
  getResponse,
  getPermission,
  preventStringHandler,
  preventNumericHandler,
  preventSpecialCharHandler,
};
