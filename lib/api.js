import axios from "axios"

const API_URL = "/v-apiserver"
const instance = axios.create({
  baseURL: API_URL,
  timeout: 120000,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
})

instance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error?.response && error?.response?.status === 401) {
      // window.location.href = "/login";
      //redirect if 401 exclude 'login' route
      const excludePaths = [
        "/login",
        "/forgotPassword",
        "/reset-password",
        "/forgot-password",
      ]
      if (
        typeof window !== "undefined" &&
        !excludePaths.includes(window.location.pathname)
      ) {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export const userLogin = async (data) => {
  try {
    const response = await instance.post("/REST/central/user/auth/login", data)
    let userInfo = JSON.stringify(response.data.result[0].user)
    let JSESSIONID = JSON.stringify(response.data.result[0].jsessionid)
    let siteName = response.data.result[0].siteName
    localStorage.setItem("user-info", userInfo)
    localStorage.setItem("JSESSIONID", JSESSIONID)
    localStorage.setItem("isloggedin", true)
    localStorage.setItem("siteName", siteName)
    return response.data
  } catch (error) {
    localStorage.setItem("user-info", "")
    localStorage.setItem("JSESSIONID", "")
    localStorage.setItem("isloggedin", false)
    return error?.response?.data
  }
}
export const userLogout = async () => {
  try {
    const response = await instance.get("/REST/central/user/auth/logout")
    localStorage.setItem("user-info", "")
    localStorage.setItem("isloggedin", false)
    return response.data
  } catch (error) {
    throw error
  }
}
export const getCities = async () => {
  try {
    const response = await instance.get("/REST/dashboard/city")
    return response
  } catch (error) {
    throw error
  }
}
export const getAreas = async (cityid) => {
  try {
    const response = await instance.get(`/REST/dashboard/${cityid}/area`)
    return response
  } catch (error) {
    throw error
  }
}
export const getJunctions = async (cityid, areaid) => {
  try {
    const response = await instance.get(
      `/REST/dashboard/${cityid}/${areaid}/junction`
    )
    return response
  } catch (error) {
    throw error
  }
}
export const getChannels = async (cityid, areaid, junctionid) => {
  try {
    const response = await instance.get(
      `REST/dashboard/${cityid}/${areaid}/${junctionid}/channel`
    )
    return response
  } catch (error) {
    throw error
  }
}

export const startLive = async (data) => {
  try {
    const response = await instance.post("/REST/startlive", data)
    // console.log("123", response)
    return response
  } catch (error) {
    throw error
  }
}
export const keepAlive = async (streamsessionid) => {
  try {
    const response = await instance.get(
      `/REST/live/keepalive/${streamsessionid}`
    )
    return response
  } catch (error) {
    throw error
  }
}
export const stopLive = async (streamsessionid) => {
  try {
    const response = await instance.get(`/REST/stoplive/${streamsessionid}`)
    return response
  } catch (error) {
    throw error
  }
}
export const startArchive = async (payload) => {
  try {
    const response = await instance.post("/REST/startarchive", payload)
    return response
  } catch (error) {
    throw error
  }
}
export const keepAliveArchive = async (streamsessionid) => {
  try {
    const response = await instance.get(
      `/REST/archive/keepalive/${streamsessionid}`
    )
    return response
  } catch (error) {
    throw error
  }
}
export const stopArchive = async (streamsessionid) => {
  try {
    const response = await instance.get(`/REST/stoparchive/${streamsessionid}`)
    return response
  } catch (error) {
    throw error
  }
}
export const getBarClips = async (payload) => {
  try {
    const response = await instance.post("/REST/archive/barclip", payload)
    return response
  } catch (error) {
    throw error
  }
}
export const getBarChartOutputs = async () => {
  try {
    const response = await instance.post("/REST/archive/barchart")
    return response
  } catch (error) {
    throw error
  }
}
/*Reset Password */
export const getLoginUserSecurityQuestions = async (data) => {
  try {
    const response = await instance.get(
      "REST/central/user/security/questions/" + data
    )
    // console.log(response.data.result);
    return response
  } catch (error) {
    throw error
  }
}
export const resetLoginPassword = async (data) => {
  // console.log("test")
  try {
    const response = await instance.put(
      "REST/central/user/reset/password",
      data
    )
    // console.log(response)
    return response
  } catch (error) {
    return error
  }
}
export const getFileContent = async (data) => {
  try {
    const response = await instance.post("/REST/site/event/snap", data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data.result[0]
  } catch (error) {
    throw error
  }
}
/*violation type - getLicensedAnalytics */
export const getViolationString = async (data) => {
  try {
    const response = await instance.get("REST/site/violations/type")
    let violationTypes = response.data.result
    // console.log(violationTypes);
    // console.log(error);

    const violationObject = violationTypes.find((obj) => obj.alerttype === data)
    if (violationObject) {
      return violationObject.alertname
    } else {
      const alertresponse = await instance.get("REST/site/alert/type")
      let alertTypes = alertresponse.data.result
      const alertObject = alertTypes.find((obj) => obj.alerttype === data)
      if (alertObject) {
        return alertObject.alertname
      } else {
        return ""
      }
    }
  } catch (error) {
    // console.log(error);
    throw error
  }
}
export const getAlertTypes = async () => {
  try {
    const response = await instance.get("REST/site/alert/type")
    return response.data.result
  } catch (error) {
    throw error
  }
}

export const getViolationStringData = async () => {
  try {
    const response = await instance.get("REST/site/violations/type")
    return response.data.result
  } catch (error) {
    throw error
  }
}

// export const getLicensedAnalytics = async() =>{
//   try{
//     const response = await instance.get('REST/site/alert/type');
//     // console.log(response);
//     return response;
//   }
//   catch (error) {
//     console.log(error);
//     throw error;
//   }
// }
//getAllChannel
export const getAllChannels = async () => {
  try {
    const response = await instance.get("REST/channel")
    return response.data.result
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getRoleList = async () => {
  try {
    const response = await instance.get("/REST/central/user/profiles")
    return response.data.result
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getUsersList = async () => {
  try {
    const response = await instance.get("/REST/central/user")
    return response.data.result
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const addUser = async (user) => {
  try {
    const response = await instance.post("/REST/central/user", user)
    return response.data.result
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateUser = async (user) => {
  try {
    const response = await instance.put("/REST/central/user", user)
    return response.data.result
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteUser = async (userId) => {
  try {
    const response = await instance.delete("/REST/central/user/" + userId)
    return response.data.result
  } catch (error) {
    console.log(error)
  }
}
export const getHotlistedEvent = async () => {
  try {
    const response = await instance.get("REST/event/hotlisted")
    console.log("api", response.data.result)
    return response.data.result
  } catch (error) {
    throw error
  }
}

export const updateHotlistedEvent = async (payload) => {
  try {
    const response = await instance.put("REST/event/hotlisted", payload)
    return response.data.result
  } catch (error) {
    throw error
  }
}

export const getProcessUnitList = async () => {
  try {
    const response = await instance.get("REST/site/processing/unit")
    console.log("api", response.data.result)
    return response.data.result
  } catch (error) {
    throw error
  }
}
export const getAllEventRecords = async (test) => {
  try {
    const response = await instance.post("REST/event", test)
    // console.log("payload",response);
    return response.data.result
  } catch (error) {
    throw error
  }
}
export const getUnitById = async (id) => {
  try {
    const response = await instance.get(
      "REST/site/processing/unit/allocate/" + id
    )
    console.log("api", response.data.result)
    return response.data.result
  } catch (error) {
    throw error
  }
}
export const getValidation = async (payload) => {
  try {
    const response = await instance.put("REST/event/acknowledge", payload)
    // console.log("res",response);
    return response.data.result
  } catch (error) {
    throw error
  }
}

export const updateValidation = async (payload) => {
  try {
    const response = await instance.post("/REST/event/rlvd", payload)
    return response.data.result
  } catch (error) {
    throw error
  }
}

export const getScheduleList = async () => {
  try {
    const response = await instance.get("REST/schedule")
    // console.log("api", response.data.result)
    return response.data.result
  } catch (error) {
    throw error
  }
}

export const getHeartBeat = async () => {
  try {
    const response = await instance.get("REST/site/heartbeat")
    // console.log("api", response.data.result)
    return response.data.result
  } catch (error) {
    throw error
  }
}

export const getCentralStorageList = async () => {
  try {
    const response = await instance.get("REST/status/storage")
    console.log("status/storage", response.data.result)
    return response.data.result
  } catch (error) {
    throw error
  }
}

export const getJunctionsList = async () => {
  try {
    const response = await instance.get("REST/site/junction")
    // console.log("JunctionsList", response.data.result)
    return response.data.result
  } catch (error) {
    throw error
  }
}
export const getJunctionTree = async () => {
  try {
    const response = await instance.get("REST/site/junctiontree")
    console.log("junctiontree", response.data.result)
    return response.data.result
  } catch (error) {
    throw error
  }
}

//getAllLoggedUsersStatus
export const getAllLoggedUsersStatus = async () => {
  try {
    const response = await instance.get("REST/status/user")
    // console.log(response);
    return response
  } catch (error) {
    throw error
  }
}
//getAllJunctionStatus
export const getAllJunctionStatus = async () => {
  try {
    const response = await instance.get("REST/status/junction")
    // console.log(response);
    return response
  } catch (error) {
    throw error
  }
}
//getAllEventReceiverStatus
export const getAllEventReceiverStatus = async () => {
  try {
    const response = await instance.get("REST/status/event/receiver")
    // console.log(response);
    return response
  } catch (error) {
    throw error
  }
}
//getAllRecordedClipReceiverStatus
export const getAllRecordedClipReceiverStatus = async () => {
  try {
    const response = await instance.get("REST/status/recorded/clip/receiver")
    // console.log(response);
    return response
  } catch (error) {
    throw error
  }
}

export const getAnalyticsServers = async () => {
  try {
    const response = await instance.get("REST/analytic/server")
    // console.log("analytics server list", response)
    return response.data.result
  } catch (error) {
    throw error
  }
}
//getCentralStorageStatus
export const getCentralStorageStatus = async () => {
  try {
    const response = await instance.get("REST/status/storage")
    // console.log(response);
    return response
  } catch (error) {
    throw error
  }
}
//getAllEventClipReceiverStatus
export const getAllEventClipReceiverStatus = async () => {
  try {
    const response = await instance.get("REST/status/event/clip/receiver")
    // console.log(response);
    return response
  } catch (error) {
    throw error
  }
}
//getSiteStatus
export const getSiteStatus = async () => {
  try {
    const response = await instance.get("REST/status/site")
    console.log("getSiteStatus", response)
    return response
  } catch (error) {
    throw error
  }
}
//getJunctionStatus
export const getJunctionStatus = async (id) => {
  try {
    const response = await instance.get(`REST/status/junction/${id}`)
    // console.log(response);
    return response
  } catch (error) {
    throw error
  }
}
//sendLoginUserMessage
export const sendLoginUserMessage = async (data) => {
  try {
    const response = await instance.post(
      "/REST/central/user/send/message",
      data
    )
    return response.data
  } catch (error) {
    return error.response.data
  }
}
export const getAnalyticsCameras = async (id) => {
  try {
    const response = await instance.get("REST/channel/" + id)
    return response.data.result
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const getAnalyticsTypes = async () => {
  try {
    const response = await instance.get("REST/site/alert/type")
    return response.data.result
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const getConfigAnalyticsTypes = async () => {
  try {
    const response = await instance.get("REST/analytictype/5")
    return response.data.result
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getDashboardOverviewCount = async (payload) => {
  try {
    
    const response = await instance.post(
      "REST/dashboard/overview/count",
      payload
    )
    return response
  } catch (error) {
    throw error

    // console.log(error)
  }
}

export const getAverageTrafficSpeed = async (payload) => {
  try {
    const response = await instance.post(
      "REST/dashboard/speed/average/traffic-speed/overview",
      payload
    )
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getAverageTrafficSpeedGraphs = async (payload) => {
  try {
    const response = await instance.post(
      "/REST/dashboard/speed/average/traffic-speed/graph",
      payload
    )
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getDashboardOverviewTrafficViolation = async (payload) => {
  try {
    const response = await instance.post(
      "REST/dashboard/overview/traffic/violation",
      payload
    )
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const getDashboardOverviewTrafficFlow = async (payload) => {
  try {
    const response = await instance.post(
      "/REST/dashboard/overview/traffic/flow",
      payload
    )
    return response
  } catch (error) {
    // console.log(error)
    throw error
  }
}

export const updateBookMark = async (id, body) => {
  try {
    const response = await instance.post(
      `REST/central/user/bookmark/${id}`,
      body
    )

    return response.data.result
  } catch (error) {
    throw error
  }
}
export const getSnapByChannelId = async (id) => {
  try {
    const response = await instance.get(`REST/channel/${id}/snap`)
    return response.data.result
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const fetchBookMarkedApi = async (id) => {
  try {
    const response = await instance.get(`REST/central/user/bookmark/${id}`)
    return response.data.result
  } catch (error) {
    throw error
  }
}

export const editBookMarkedApi = async (id) => {
  try {
    const response = await instance.put(`REST/central/user/bookmark/${id}`)
    return response.data.result
  } catch (error) {
    throw error
  }
}

export const deleteBookMarked = async (id, nName) => {
  try {
    const response = await instance.delete(
      `REST/central/user/bookmark/${id}/` + nName
    )
    // console.log("delete", response)
    return response.data.result
  } catch (error) {
    throw error
  }
}
//updateUserDetails
export const updateUserDetails = async (data) => {
  try {
    const response = await instance.put("REST/central/user", data)
    return response
  } catch (error) {
    return error
  }
}

export const getStorageConfigById = async (id) => {
  try {
    const response = await instance.get(`REST/storage/local/${id}/available`)
    return response.data.result
  } catch (error) {
    throw error
  }
}
//changePassword
export const changePassword = async (data) => {
  try {
    const response = await instance.put(
      "REST/central/user/update/password",
      data
    )
    return response
  } catch (error) {
    return error
  }
}
export const getAnalyticJobListById = async (id) => {
  try {
    const response = await instance.post(`REST/analytic/job/retrive`, {
      vasId: id,
    })
    return response.data.result
  } catch (error) {
    throw error
  }
}

export const getAllRadarById = async (id) => {
  try {
    const response = await instance.get(`REST/radar/${id}`)
    return response.data.result
  } catch (error) {
    throw error
  }
}

//updateRolesPermission
export const updateRolesPermission = async (data) => {
  try {
    const response = await instance.put("REST/central/user/profile", data)
    return response
  } catch (error) {
    return error
  }
}

export const fetchPagination = async (data) => {
  try {
    const response = await instance.post("REST/event/count", data)
    // console.log("response",response)
    return response
  } catch (error) {
    return error
  }
}
export const getDashboardChartEvents = async (payload) => {
  try {
    const response = await instance.post("REST/dashboard/chart/events", payload)
    return response.data.result
  } catch (error) {
    throw error
  }
}

// map

export const updateDashboardMapEvents = async (payload) => {
  try {
    const response = await instance.post("REST/dashboard/map/events", payload)
    return response.data.result
  } catch (error) {
    throw error
  }
}

//getjunctionview
export const getjunctionview = async () => {
  try {
    const response = await instance.get(`REST/vdashboard/junctionview`)
    return response
  } catch (error) {
    throw error
  }
}

export const isValidEventButton = async () => {
  try {
    const response = await instance.get("REST/analytictype/2")
    return response.data.result
  } catch (error) {
    throw error
  }
}

//getcameraview
export const getcameraview = async () => {
  try {
    const response = await instance.get(`REST/vdashboard/cameraview`)
    return response
  } catch (error) {
    throw error
  }
}
export const getViolationsToDisplay = async () => {
  try {
    const response = await instance.get("REST/analytictype/1")
    return response.data.result
  } catch (error) {
    throw error
  }
}

//centralview
export const getcentralview = async () => {
  try {
    const response = await instance.get(`REST/vdashboard/centralview`)
    return response
  } catch (error) {
    throw error
  }
}
export const enableVehicleNumber = async () => {
  try {
    const response = await instance.get("REST/analytictype/3")
    return response.data.result
  } catch (error) {
    throw error
  }
}
export const getAnalyticsForMis = async () => {
  try {
    const response = await instance.get("REST/analytictype/0")
    return response
  } catch (error) {
    throw error
  }
}
export const exportMis = async (data) => {
  try {
    const response = await instance.get(`REST/site/mis/report/?${data}`)
    return response
  } catch (error) {
    throw error
  }
}
export const getAllAnalytics = async () => {
  try {
    const response = await instance.get("REST/analytictype/-1")
    return response.data.result
  } catch (error) {
    throw error
  }
}
//
export const saveSiteName = async (siteName) => {
  try {
    const response = await instance.get(`/REST/site/${siteName}`)
    return response
  } catch (error) {
    throw error
  }
}

export const triggerEvent = async (payload) => {
  try {
    const response = await instance.post(
      "REST/event/trigger/composite",
      payload
    )
    return response.data.result
  } catch (error) {
    throw error
  }
}
//Cleaning Configuration SAVE
export const saveCleaningConfiguration = async (payload) => {
  try {
    const response = await instance.post(
      "/REST/configuration/cleaning/set",
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}
//Cleaning Configuration get

export const getCleaningConfiguration = async () => {
  const payload = {
    componentId: -1,
    eventAckStatus: -1,
    eventType: -1,
    processId: -1,
  }
  try {
    const response = await instance.post(
      "/REST/configuration/cleaning",
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}
//Get all available storage
export const getAllAvailableStorages = async () => {
  try {
    const response = await instance.get("/REST/storage/vms/available")
    return response.data.result
  } catch (error) {
    throw error
  }
}
//Get all available active storage
export const getActiveAvailableStorages = async () => {
  try {
    const response = await instance.get("/REST/storage/vms/current")
    return response.data.result
  } catch (error) {
    throw error
  }
}
//get user name & password for unused storages
export const getStoragesUserNameAndPassword = async (payload) => {
  try {
    const response = await instance.post("/REST/storage/vms/info", payload)
    return response.data.result
  } catch (error) {
    throw error
  }
}
//save storage api
export const saveConfigStorage = async (payload) => {
  try {
    const response = await instance.post("/REST/storage/vms", payload)
    return response
  } catch (error) {
    throw error
  }
}
//Get all active storage by ID
export const getCurrentStoragesById = async (id) => {
  try {
    const response = await instance.get(`REST/storage/local/${id}/current`)
    return response.data.result
  } catch (error) {
    throw error
  }
}
//getjunctionStoragesUserNameAndPassword
export const getjunctionStoragesUserNameAndPassword = async (payload) => {
  try {
    const response = await instance.post("/REST/storage/ms/info", payload)
    return response.data.result
  } catch (error) {
    throw error
  }
}
//save junction storage
export const saveJunctionStorage = async (payload, mediaServerID) => {
  try {
    const response = await instance.post(
      `/REST/storage/local/${mediaServerID}`,
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}
//get all radar model
export const getAllRadarModel = async () => {
  try {
    const response = await instance.get("REST/radar/model")
    return response.data.result
  } catch (error) {
    throw error
  }
}

//save new radar
export const saveNewRadar = async (payload, mediaServerID) => {
  try {
    const response = await instance.put(`REST/radar/${mediaServerID}`, payload)
    return response
  } catch (error) {
    throw error
  }
}
//GET Associated Cameras
export const getAssociatedCameras = async (mediaServerID) => {
  try {
    const response = await instance.get(`REST/radar/camera/${mediaServerID}`)
    return response.data.result
  } catch (error) {
    throw error
  }
}

//GET Signal Details Controller Model
export const getSignalDetailsControllerModel = async () => {
  try {
    const response = await instance.get(
      "REST/configuration/signal/controller/model"
    )
    return response.data.result
  } catch (error) {
    throw error
  }
}
//GET Vehicle Details Controller Model
export const getVehicleDetailsControllerModel = async () => {
  try {
    const response = await instance.get(
      "REST/configuration/atcs/controller/model"
    )
    return response.data.result
  } catch (error) {
    throw error
  }
}
//GET Signal Details Configuration
export const getSignalDetailsConfiguration = async (mediaServerID) => {
  try {
    const response = await instance.get(
      `REST/configuration/signal/controller/${mediaServerID}`
    )
    return response.data.result
  } catch (error) {
    throw error
  }
}
//GET Vehicle Details Configuration
export const getVehicleDetailsConfiguration = async (mediaServerID) => {
  try {
    const response = await instance.get(
      `REST/configuration/atcs/controller/${mediaServerID}`
    )
    return response.data.result
  } catch (error) {
    throw error
  }
}
//SAVE Signal  Details Configuration
export const saveSignalDetailsConfig = async (payload, mediaServerID) => {
  try {
    const response = await instance.put(
      `REST/configuration/signal/controller/${mediaServerID}`,
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}
//SAVE Vehicle  Details Configuration
export const saveVehicleDetailsConfig = async (payload, mediaServerID) => {
  try {
    const response = await instance.put(
      `REST/configuration/atcs/controller/${mediaServerID}`,
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}
//getMediaserver
export const getMediaserver = async () => {
  try {
    const response = await instance.get(`REST/site/mediaserver`)
    return response
  } catch (error) {
    throw error
  }
}

// addCamera
export const addCamera = async (payload) => {
  try {
    const response = await instance.post("REST/channel/media", payload)
    return response
  } catch (error) {
    throw error
  }
}

// getSearchModel
export const getSearchModel = async () => {
  try {
    const response = await instance.get(`REST/channel/search/model`)
    return response
  } catch (error) {
    throw error
  }
}

//cameraSearch
export const updateCameraSearch = async (payload) => {
  try {
    const response = await instance.post("/REST/channel/search", payload)
    return response
  } catch (error) {
    throw error
  }
}
//cameraSnap
export const updateCameraSnap = async (payload) => {
  try {
    const response = await instance.post("/REST/channel/search/snap", payload)
    return response
  } catch (error) {
    throw error
  }
}
export const getEventColor = async () => {
  try {
    const response = await instance.get("REST/event/configuration/color")
    return response
  } catch (error) {
    throw error
  }
}
export const saveEventColor = async (payload) => {
  try {
    const response = await instance.post(
      "REST/event/configuration/color",
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}
export const updateEventColor = async (payload) => {
  try {
    const response = await instance.put(
      "REST/event/configuration/color",
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}
export const deleteEventColor = async (appid) => {
  try {
    const response = await instance.delete(
      `REST/event/configuration/color/${appid}`
    )
    return response
  } catch (error) {
    throw error
  }
}
//Schedule Configuration (Add New)
export const saveScheduleConfiguration = async (payload) => {
  try {
    const response = await instance.post("/REST/schedule", payload)
    return response
  } catch (error) {
    throw error
  }
}
//Schedule Configuration (Update)
export const updateScheduleConfiguration = async (payload) => {
  try {
    const response = await instance.put("/REST/schedule", payload)
    return response
  } catch (error) {
    throw error
  }
}

//Delete Schedule
export const deleteSchedule = async (scheduleid) => {
  try {
    const response = await instance.delete(`REST/schedule/${scheduleid}`)
    return response
  } catch (error) {
    throw error
  }
}

//get special days
export const getSpecialDays = async () => {
  try {
    const response = await instance.get(`REST/schedule/specialday`)
    return response
  } catch (error) {
    throw error
  }
}

//save special days
export const saveSpecialDays = async (payload) => {
  try {
    const response = await instance.post(`REST/schedule/specialday`, payload)
    return response
  } catch (error) {
    throw error
  }
}

// searchDetails
export const updateSearchDetails = async (payload) => {
  try {
    const response = await instance.post("/REST/channel/search/detail", payload)
    return response
  } catch (error) {
    throw error
  }
}
//Add new camera Association
export const addNewCameraAssociation = async (payload, mediaServerID) => {
  try {
    const response = await instance.post(
      `REST/radar/camera/${mediaServerID}`,
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}
//get camera assosiation
export const getCameraAssosiation = async (mediaServerID) => {
  try {
    const response = await instance.get(
      `REST/channel/${mediaServerID}/association`
    )
    return response.data.result
  } catch (error) {
    throw error
  }
}
//Adam Setting
export const adamSetting = async (payload) => {
  try {
    const response = await instance.post(`REST/adams`, payload)
    return response.data.result
  } catch (error) {
    throw error
  }
}
//Evidence Setting
export const evidenceSetting = async (payload) => {
  try {
    const response = await instance.post("REST/event/evidence", payload)
    return response.data.result
  } catch (error) {
    throw error
  }
}
//Save Analytics
export const saveAnalytics = async (payload) => {
  try {
    const response = await instance.post("REST/analytic/job", payload)
    return response
  } catch (error) {
    throw error
  }
}
export const getEventAudio = async () => {
  try {
    const response = await instance.get("REST/event/configuration/audio")
    return response
  } catch (error) {
    throw error
  }
}

export const saveEventAudio = async (payload) => {
  try {
    const response = await axios.post(
      "/v-apiserver/REST/event/configuration/audio",
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}

export const deleteEventAudio = async (appid) => {
  try {
    const response = await instance.delete(
      `REST/event/configuration/audio/${appid}`
    )
    return response
  } catch (error) {
    throw error
  }
}

export const updateEventAudio = async (payload) => {
  try {
    const response = await instance.post(
      "REST/event/configuration/audio/update",
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}

export const getChallanServerDevice = async () => {
  try {
    const response = await instance.get("REST/challan/server/device")
    return response
  } catch (error) {
    throw error
  }
}

export const registerChallanServerDevice = async (payload) => {
  try {
    const response = await instance.post("REST/challan/server/device", payload)
    return response.data.message
  } catch (error) {
    // console.log(error.response.data.message)
    return error.response.data.message
    throw error
  }
}

export const sendOtp = async (otp) => {
  try {
    const response = await instance.get(`REST/challan/server/${otp}`)
    return response
  } catch (error) {
    throw error
  }
}

export const getChallanAutoPush = async () => {
  try {
    const response = await instance.get("REST/configuration/challan/autopush")
    return response
  } catch (error) {
    throw error
  }
}

export const saveChallanAutoPush = async (payload) => {
  try {
    const response = await instance.post(
      "REST/configuration/challan/autopush",
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}

export const getLogCount = async (payload) => {
  try {
    const response = await instance.post("REST/log/count", payload)
    return response
  } catch (error) {
    throw error
  }
}

export const getLogs = async (payload) => {
  try {
    const response = await instance.post("REST/log", payload)
    return response
  } catch (error) {
    throw error
  }
}

//search accident
export const searchAccident = async (payload) => {
  try {
    const response = await instance.post("REST/accident/search", payload)
    return response
  } catch (error) {
    throw error
  }
}
export const getImage = async (data) => {
  try {
    const response = await instance.post("/REST/site/event/snap", data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response
  } catch (error) {
    throw error
  }
}
//deleteJob
export const deleteAnalyticJob = async (payload) => {
  try {
    const response = await instance.post("REST/analytic/job/delete", payload)
    return response
  } catch (error) {
    throw error
  }
}
//Retrieve Analytic Jobs
export const retrieveAnalyticJobs = async (payload) => {
  try {
    const response = await instance.post("REST/analytic/job/retrive", payload)
    return response
  } catch (error) {
    throw error
  }
}
//Add Evidence Settings
export const addEvidenceSettings = async (payload) => {
  try {
    const response = await instance.post("REST/event/evidence/add", payload)
    return response
  } catch (error) {
    throw error
  }
}
//deleteEvidenceSettings
export const deleteEvidenceSettings = async (payload) => {
  try {
    const response = await instance.post("REST/event/evidence/delete", payload)
    return response
  } catch (error) {
    throw error
  }
}

// getChannel
export const getChannel = async () => {
  try {
    const response = await instance.get(`/REST/channel`)
    return response
  } catch (error) {
    throw error
  }
}

// allChannel
export const allChannel = async () => {
  try {
    const response = await instance.get(`/REST/channel/property`)
    return response
  } catch (error) {
    throw error
  }
}
// siteGroup
export const siteGroup = async () => {
  try {
    const response = await instance.get(`/REST/site/group`)
    return response
  } catch (error) {
    throw error
  }
}
// laneNumber
export const getLaneNumber = async (channelid) => {
  try {
    const response = await instance.get(`/REST/channel/${channelid}/param`)
    return response
  } catch (error) {
    throw error
  }
}
// streamingParams
export const fetchStreamParams = async (payload) => {
  try {
    const response = await instance.post(
      `/REST/channel/streamingparameters`,
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}
// colorParams
export const fetchColorParams = async (channelid) => {
  try {
    const response = await instance.get(
      `/REST/channel/${channelid}/imageparameters`
    )
    return response
  } catch (error) {
    throw error
  }
}
// saveLaneNum
export const saveLaneNum = async (payload) => {
  try {
    const response = await instance.post(
      `REST/channel/set/media/params`,
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}
// saveGroup
export const saveGroup = async (payload) => {
  try {
    const response = await instance.put(`/REST/channel/group`, payload)
    return response
  } catch (error) {
    throw error
  }
}

// vehicleType
export const vehicleType = async () => {
  try {
    const response = await instance.get(`/REST/vehicle/type`)
    return response
  } catch (error) {
    throw error
  }
}
// vehicleAdd
export const vehicleAdd = async (payload) => {
  try {
    const response = await instance.post(`/REST/vehicle/type`, payload)
    return response
  } catch (error) {
    throw error
  }
}
// vehDelete
export const vehDelete = async (vehicletypeid) => {
  try {
    const response = await instance.delete(
      `/REST/vehicle/type/${vehicletypeid}`
    )
    return response
  } catch (error) {
    throw error
  }
}
// vehCount
export const vehCount = async (payload) => {
  try {
    const response = await instance.post(`/REST/vehicle/count`, payload)
    return response
  } catch (error) {
    throw error
  }
}
// vehData
export const vehData = async (payload) => {
  try {
    const response = await instance.post(`/REST/vehicle/retrieve`, payload)
    return response
  } catch (error) {
    throw error
  }
}
// deRegVehicle
export const deRegVehicle = async (vehiclenumber) => {
  try {
    const response = await instance.delete(`/REST/vehicle/${vehiclenumber}`)
    return response
  } catch (error) {
    throw error
  }
}
// checkVehReg
export const checkVehReg = async (vehiclenumber) => {
  try {
    const response = await instance.get(
      `REST/vehicle/check/registered/${vehiclenumber}`
    )
    return response
  } catch (error) {
    throw error
  }
}
// regVehicle
export const regVehicle = async (payload) => {
  try {
    const response = await instance.post(`REST/vehicle`, payload)
    return response
  } catch (error) {
    throw error
  }
} // updateVehicle
export const updateVehicle = async (payload) => {
  try {
    const response = await instance.put(`REST/vehicle`, payload)
    return response
  } catch (error) {
    throw error
  }
}
// siteMap
export const siteMap = async (mapid) => {
  try {
    const response = await instance.get(`/REST/map/${mapid}`)
    return response
  } catch (error) {
    throw error
  }
}
// junctionApi
export const junctionApi = async () => {
  try {
    const response = await instance.get(`REST/site/junctiontree`)
    return response
  } catch (error) {
    throw error
  }
}
// getMapById
export const getMapById = async (mapid) => {
  try {
    const response = await instance.get(`/REST/map/childmaps/${mapid}`)
    return response
  } catch (error) {
    throw error
  }
}
// getJunctionMapById
export const getJunctionMapById = async (mapid) => {
  try {
    const response = await instance.get(`/REST/map/junction/${mapid}`)
    return response
  } catch (error) {
    throw error
  }
}
// getChannelMapById
export const getChannelMapById = async (mapid) => {
  try {
    const response = await instance.get(`/REST/map/channel/${mapid}`)
    return response
  } catch (error) {
    throw error
  }
}
// save junction
export const saveJunctionMapById = async (payload) => {
  try {
    const response = await instance.post(`/REST/map/junction`, payload)
    return response
  } catch (error) {
    throw error
  }
}

// send email and sms

export const emailAndSms = async (eventId, msid, triggerSmsEmail) => {
  try {
    const response = await instance.get(
      `/REST/channel/send/email/${eventId}/${msid}/${triggerSmsEmail}`
    )
    return response
  } catch (error) {
    throw error
  }
}
export const getLpSnap = async (payload) => {
  try {
    const response = await instance.post("/REST/site/event/lpsnap", payload)
    return response
  } catch (error) {
    throw error
  }
}
export const getEventRecords = async (payload) => {
  try {
    const response = await instance.post("/REST/event", payload)
    return response
  } catch (error) {
    throw error
  }
}
//allocate new junction

export const allocateJunction = async (payload) => {
  try {
    const response = await instance.post(
      "REST/site/processing/unit/allocate",
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}
export const stopSearch = async (payload) => {
  try {
    const response = await instance.post("/REST/channel/search/stop", payload)
    return response
  } catch (error) {
    throw error
  }
}
//Delete Camera Analytics
export const deleteCameraAnalytics = async (payload) => {
  try {
    const response = await instance.delete("REST/channel/vas", {
      data: payload,
    })
    console.log(response, "apiresponse")
    return response
  } catch (error) {
    throw error
  }
}
//get junction list
export const getChannelByJunction = async (junctionId) => {
  try {
    const response = await instance.get(`/REST/channel/${junctionId}`)
    return response
  } catch (error) {
    throw error
  }
}
//delete camera
export const deleteCamera = async (channelid, msid, comment, payload) => {
  try {
    const response = await instance.delete(
      `/REST/channel/${channelid}/${msid}/${comment}`,
      { data: payload }
    )
    return response
  } catch (error) {
    throw error
  }
}

export const avgSpeedInJunc = async (payload) => {
  try {
    const response = await instance.post("/REST/dashboard/speed/average/traffic-speed/map", payload)
    return response
  } catch (error) {
    throw error
  }
}

export const updateSchedule = async (payload) => {
  try {
    const response = await instance.put("/REST/channel/recording", payload)
    return response
  } catch (error) {
    throw error
  }
}
export const updateRecStream = async (payload) => {
  try {
    const response = await instance.put("/REST/channel/recordingstream", payload)
    return response
  } catch (error) {
    throw error
  }
}

export const updateImgParam = async (payload) => {
  try {
    const response = await instance.put("/REST/channel/image/parameter", payload)
    return response
  } catch (error) {
    throw error
  }
}

