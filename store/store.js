import { create } from "zustand"

import {
  allChannel,
  checkVehReg,
  emailAndSms,
  fetchBookMarkedApi,
  fetchColorParams,
  getAlertTypes,
  getAllChannels,
  getAnalyticsForMis,
  getAreas,
  getAverageTrafficSpeed,
  getAverageTrafficSpeedGraphs,
  getChannel,
  getChannelMapById,
  getChannels,
  getCities,
  getDashboardChartEvents,
  getDashboardOverviewCount,
  getDashboardOverviewTrafficFlow,
  getDashboardOverviewTrafficViolation,
  getJunctionMapById,
  getJunctionTree,
  getJunctions,
  getJunctionsList,
  getLaneNumber,
  getMapById,
  getMediaserver,
  getRoleList,
  getSearchModel,
  getSiteStatus,
  getUsersList,
  getViolationStringData,
  getcameraview,
  getcentralview,
  getjunctionview,
  junctionApi,
  siteGroup,
  siteMap,
  startArchive,
  startLive,
  updateBookMark,
  updateCameraSearch,
  vehicleType,
} from "../lib/api"

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const useStore = create((set, get) => ({
  junctions: [],
  videoStitching: false,
  error: null,
  cities: [],
  selectedCity: 0,
  areas: [],
  selectedArea: "",
  channels: [],
  selectedAreaId: null,
  junctionId: null,
  junctionMsId: null,
  description: "",
  archiveStreamingId: [],
  startTimeStamp: null,
  endTimeStamp: null,
  startTimes: [],
  startingTimes: [],
  channelId: null,
  isDisabled: true,
  totalIndividualsNotified: [],
  totalIndividualsNotified2: [],
  totalIndividualsNotifiedYesterday: [],
  totalIndividualsNotified2Yesterday: [],
  totalIndividualsNotifiedYesterday: [],
  totalIndividualsNotified2Yesterday: [],
  totalVehicleFlow: [],
  totalVehicleFlowYesterDay: [],
  totalViolations: [],
  totalViolationsYesterDay: [],
  violations: [],
  trafficFlowViolationsPieChartsData: [],
  trafficViolationsPieChartsData: [],
  violationChartsData: [],
  flowChartsData: [],
  alertTypes: [],
  averageTrafficSpeed: [],
  averageTrafficSpeedYesterday: [],
  averageTrafficSpeedGraphsData: [],
  displayText: false,
  toggleDisplayText: () =>
    set((state) => ({ displayText: !state.displayText })),
  setIsDisabled: (val) => set(() => ({ isDisabled: val })),
  setChannelId: (val) => set(() => ({ channelId: val })),
  setStartingTimes: (val) => set(() => ({ startingTimes: val })),
  setStartTimes: (val) => set(() => ({ startTimes: val })),
  setArchiveStreamingId: (val) => set(() => ({ archiveStreamingId: val })),
  setVideoStitching: () => {
    set((state) => ({ videoStitching: !state.videoStitching }))
  },
  setAlertTypes: async () => {
    try {
      const response = await getAlertTypes()
      set({ alertTypes: response.data.result })
    } catch (error) {
      set({ error: `${error.message}alertTypes` })
    }
  },
  setCities: async () => {
    try {
      const response = await getCities()
      set({
        cities: response.data.result,
      })
    } catch (error) {
      set({ error: `${error.message}cities` })
    }
  },
  setSelectedCity: (val) => set(() => ({ selectedCity: val })),
  setSelectedAreaId: (val) => set(() => ({ selectedAreaId: val })),
  setStartTimeStamp: (val) => set(() => ({ startTimeStamp: val })),
  setEndTimeStamp: (val) => set(() => ({ endTimeStamp: val })),
  currentPage: 1,
  setNextPage: (val) => set((state) => ({ currentPage: state + val })),
  setPrevPage: (val) => set((state) => ({ currentPage: state - val })),
  bookMarkedList: [],
  setBookMarkedList: async () => {
    try {
      const profileId = JSON.parse(localStorage.getItem("user-info")).profileId
      const response = await fetchBookMarkedApi(profileId)
      set({
        bookMarkedList: response,
      })
    } catch (error) {
      set({ error: `${error.message}bookMarkedList` })
    }
  },
  addBookMark: async (id, body) => {
    try {
      const response = await updateBookMark(id, body)
      return response
    } catch (error) {
      console.log(error)
      set({ error: `${error.message}` })
    }
  },
  setAreas: async (cityid) => {
    try {
      const response = await getAreas(cityid)
      set({
        areas: response.data.result,
      })
    } catch (error) {
      set({ error: `${error.message}areas` })
    }
  },
  setTotalIndividualsNotified: async (data) => {
    try {
      const response = await getDashboardOverviewCount(data)
      set({ totalIndividualsNotified: response.data.result })
    } catch (error) {
      set({ error: error })
    }
  },
  setTotalIndividualsNotifiedYesterday: async (data) => {
    try {
      const response = await getDashboardOverviewCount(data)
      set({ totalIndividualsNotifiedYesterday: response.data.result })
    } catch (error) {
      set({ error: error })
    }
  },
  setTotalIndividualsNotified2: async (data) => {
    try {
      const response = await getDashboardOverviewCount(data)
      set({ totalIndividualsNotified2: response.data.result })
    } catch (error) {
      set({ error: error })
    }
  },
  setTotalIndividualsNotified2Yesterday: async (data) => {
    try {
      const response = await getDashboardOverviewCount(data)
      set({ totalIndividualsNotified2Yesterday: response.data.result })
    } catch (error) {
      set({ error: error })
    }
  },
  setAverageTrafficSpeed: async (data) => {
    try {
      const response = await getAverageTrafficSpeed(data)
      set({ averageTrafficSpeed: response.data.result })
    } catch (error) {
      set({ error: error })
    }
  },
  setAverageTrafficSpeedYesterday: async (data) => {
    try {
      const response = await getAverageTrafficSpeed(data)
      set({ averageTrafficSpeedYesterday: response.data.result })
    } catch (error) {
      set({ error: error })
    }
  },
  setAverageTrafficSpeedGraphs: async (data) => {
    try {
      const response = await getAverageTrafficSpeedGraphs(data)
      set({ averageTrafficSpeedGraphsData: response.data.result })
    } catch (error) {
      set({ error: error })
    }
  },
  setTotalVehicleFlow: async (data) => {
    try {
      const response = await getDashboardOverviewCount(data)
      set({ totalVehicleFlow: response.data.result })
    } catch (error) {
      set({ error: error })
    }
  },
  resetOverview: (val) =>
    set(() => ({
      totalVehicleFlow: val,
      totalVehicleFlowYesterDay: val,
      totalIndividualsNotified: val,
      totalIndividualsNotifiedYesterday: val,
      totalIndividualsNotified2: val,
      totalIndividualsNotified2Yesterday: val,
      totalViolations: val,
      totalViolationsYesterDay: val,
      averageTrafficSpeed: val,
      averageTrafficSpeedYesterday: val,
      trafficFlowViolationsPieChartsData: val,
      trafficViolationsPieChartsData: val,
      flowChartsData: val,
      violationChartsData: val,
    })),
  setTotalVehicleFlowYesterday: async (data) => {
    try {
      const response = await getDashboardOverviewCount(data)
      set({ totalVehicleFlowYesterDay: response.data.result })
    } catch (error) {
      set({ error: error })
    }
  },
  setTotalViolations: async (data) => {
    try {
      const response = await getDashboardOverviewCount(data)
      set({ totalViolations: response.data.result })
    } catch (error) {
      set({ error: error })
    }
  },
  setTotalViolationsYesterday: async (data) => {
    try {
      const response = await getDashboardOverviewCount(data)
      set({ totalViolationsYesterDay: response.data.result })
    } catch (error) {
      set({ error: error })
    }
  },
  setViolations: async () => {
    try {
      const response = await getViolationStringData()
      set({ violations: response })
    } catch (error) {
      set({ error: error })
    }
  },
  alertTypes: [],
  setAlertTypes: async () => {
    try {
      const response = await getAlertTypes()
      set({ alertTypes: response })
    } catch (error) {
      set({ error: error })
    }
  },
  setTrafficViolationsPieChartsData: async (payload) => {
    try {
      const response = await getDashboardOverviewTrafficViolation(payload)
      set({ trafficViolationsPieChartsData: response.data.result })
      console.log(
        "trafficViolationsPieChartsData",
        trafficViolationsPieChartsData
      )
    } catch (error) {
      set({ error: error })
    }
  },
  setTrafficFlowViolationsPieChartsData: async (payload) => {
    try {
      const response = await getDashboardOverviewTrafficFlow(payload)
      set({ trafficFlowViolationsPieChartsData: response.data.result })
    } catch (error) {
      set({ error: error })
    }
  },
  setViolationChartsData: async (payload) => {
    try {
      const response = await getDashboardChartEvents(payload)
      set({ violationChartsData: response })
    } catch (error) {
      set({ error: error })
    }
  },
  setFlowChartsData: async (payload) => {
    try {
      const response = await getDashboardChartEvents(payload)
      set({ flowChartsData: response })
    } catch (error) {
      set({ error: error })
    }
  },
  setSelectedArea: (val) => set(() => ({ selectedArea: val })),
  setJunctions: async (cityid, areaid) => {
    try {
      const response = await getJunctions(cityid, areaid)
      set({
        junctions: response.data.result ? response.data.result : [],
      })
    } catch (error) {
      set({
        error: `${error.message}junctions`,
      })
    }
  },
  resetChannels: () => {
    set({
      channels: [],
    })
  },
  channelIds: [],
  setChannels: async (cityid, areaid, junctionid) => {
    try {
      if (cityid === null) {
        set({
          channels: [],
        })
        return
      } else {
        const { channelIds } = get()
        const response = await getChannels(cityid, areaid, junctionid)
        set({
          channels: response.data.result ? response.data.result : [],
          channelIds: [...channelIds, response.data.result],
        })
      }
    } catch (error) {
      set({
        error: `${error.message}channels`,
      })
    }
  },
  resetChannelIds: () => {
    set({
      channelIds: [],
    })
  },
  setJunctionId: (val) => set(() => ({ junctionId: val })),
  setJunctionMsId: (val) => set(() => ({ junctionMsId: val })),
  roleList: [],
  setRoleList: async () => {
    try {
      const response = await getRoleList()

      set({
        roleList: response,
      })
    } catch (error) {
      set({ error: error.message })
    }
  },
  usersList: [],
  setUsersList: async () => {
    try {
      const response = await getUsersList()

      set({
        usersList: response,
      })
    } catch (error) {
      set({ error: error.message })
    }
  },
  analyticsForMis: [],
  setAnalyticsForMis: async () => {
    try {
      const response = await getAnalyticsForMis()
      set({
        analyticsForMis: response.data.result,
      })
    } catch (error) {
      set({ error: error.message })
    }
  },
  allJunc: [],
  setJunctionsTree: async (cityid, areaid) => {
    try {
      const response = await getJunctionTree()
      set({
        allJunc: response,
      })
    } catch (error) {
      set({
        error: `${error.message}`,
      })
    }
  },
  allChannels: [],
  setAllChannels: async () => {
    try {
      const response = await getAllChannels()

      set({
        allChannels: response,
      })
    } catch (error) {
      set({ error: error.message })
    }
  },
  //junctions
  siteStatusList: [],
  setSiteStatusList: async () => {
    try {
      const response = await getSiteStatus()
      set({
        siteStatusList: response.data.result,
      })
    } catch (error) {
      set({ error: error.message })
    }
  },
  //getJunctionsList
  junctionList: [],
  setjunctionList: async () => {
    try {
      const response = await getJunctionsList()
      set({
        junctionList: response,
      })
    } catch (error) {
      set({ error: error.message })
    }
  },
  //getAllChannels
  allChannelList: [],
  setallChannelList: async () => {
    try {
      const response = await getAllChannels()
      set({
        allChannelList: response,
      })
    } catch (error) {
      set({ error: error.message })
    }
  },
  //getjunctionview
  junctionviewList: [],
  setjunctionviewList: async () => {
    try {
      const response = await getjunctionview()
      set({
        junctionviewList: response.data.result,
      })
    } catch (error) {
      set({ error: error.message })
    }
  },
  //getcameraview
  cameraviewList: [],
  setcameraviewList: async () => {
    try {
      const response = await getcameraview()
      set({
        cameraviewList: response.data.result,
      })
    } catch (error) {
      set({ error: error.message })
    }
  },
  //getChannel
  channelList: [],
  setChannelList: async () => {
    try {
      const response = await getChannel()
      set({
        channelList: response.data.result,
      })
    } catch (error) {
      set({ error: error.message })
    }
  },
  //allChannel
  allChannelList: [],
  setAllChannelList: async () => {
    try {
      const response = await allChannel()
      set({
        allChannelList: response.data.result,
      })
    } catch (error) {
      set({ error: error.message })
    }
  },
  //siteGroup
  siteGroup: [],
  setSiteGroup: async () => {
    try {
      const response = await siteGroup()
      set({
        siteGroup: response.data.result,
      })
    } catch (error) {
      set({ error: error.message })
    }
  },
  //laneNumber
  laneNum: [],
  setLaneNum: async (channelid) => {
    try {
      const response = await getLaneNumber(channelid)
      set({
        laneNum: response.data.result,
      })
    } catch (error) {
      set({ error: `${error.message}` })
    }
  },
  //colorParams
  imgParams: [],
  setImgParams: async (channelid) => {
    try {
      const response = await fetchColorParams(channelid)
      set({
        imgParams: response.data.result,
      })
    } catch (error) {
      set({ error: `${error.message}` })
    }
  },
  // vehicleType
  vehicleTypes: [],
  setVehicleTypes: async () => {
    try {
      const response = await vehicleType()
      set({
        vehicleTypes: response.data.result,
      })
    } catch (error) {
      set({ error: `${error.message}` })
    }
  },
  // vehicleRegCheck
  vehicleRegCheck: [],
  setVehicleRegCheck: async (vehiclenumber) => {
    try {
      const response = await checkVehReg(vehiclenumber)
      set({
        vehicleRegCheck: response.data.result,
      })
    } catch (error) {
      set({ error: `${error.message}` })
    }
  },
  // junctionTree
  junctionTree: [],
  setJunctionTree: async () => {
    try {
      const response = await junctionApi()
      set({
        junctionTree: response.data.result,
      })
    } catch (error) {
      set({ error: `${error.message}` })
    }
  },
  // siteMap
  siteMaps: [],
  setSiteMaps: async (mapId) => {
    try {
      const response = await siteMap(mapId)
      set({
        siteMaps: response.data.result,
      })
    } catch (error) {
      set({ error: `${error.message}` })
    }
  },
  // getMapById
  getMapByMapId: [],
  setGetMapByMapId: async (mapId) => {
    try {
      const response = await getMapById(mapId)
      set({
        getMapByMapId: response.data.result,
      })
    } catch (error) {
      set({ error: `${error.message}` })
    }
  },
  // getJunctionById
  getJunctionById: [],
  setGetJunctionById: async (mapId) => {
    try {
      const response = await getJunctionMapById(mapId)
      console.log(response)
      set({
        getJunctionById: response.data.result,
      })
    } catch (error) {
      set({ error: `${error.message}` })
    }
  },
  // getChannelById
  getChannelById: [],
  setGetChannelById: async (mapId) => {
    try {
      const response = await getChannelMapById(mapId)
      set({
        getChannelById: response.data.result,
      })
    } catch (error) {
      set({ error: `${error.message}` })
    }
  },

  //getcentralview
  centralviewList: [],
  setcentralviewList: async () => {
    try {
      const response = await getcentralview()
      set({
        centralviewList: response.data.result,
      })
    } catch (error) {
      set({ error: error.message })
    }
  },
  // getmediaserver
  mediaserver: [],
  setMediaserver: async () => {
    try {
      const response = await getMediaserver()
      set({
        mediaserver: response.data.result,
      })
    } catch (error) {
      set({ error: error.message })
    }
  },
  // getSerachModel
  searchModel: [],
  setSearchModel: async () => {
    try {
      const response = await getSearchModel()
      set({
        searchModel: response.data.result,
      })
    } catch (error) {
      set({ error: error.message })
    }
  },
  // fetchSearchCamera
  searchCamera: [],
  setSearchCamera: async (payload) => {
    try {
      const response = await updateCameraSearch(payload)
      set({ searchCamera: response.data.result })
    } catch (error) {
      set({ error: error })
    }
  },
  // email and sms
  emailSms: [],
  setEmailSms: async (eventId, msid, triggerSmsEmail) => {
    try {
      if (eventId === null) {
        set({
          emailSms: [],
        })
        return
      } else {
        const response = await emailAndSms(eventId, msid, triggerSmsEmail)
        set({ emailSms: response.data.result ? response.data.result : [] })
      }
    } catch (error) {
      set({ error: error })
    }
  },
  //Live Camera Global State
  selectedChannel: [],
  setSelectedChannel: (val) => set(() => ({ selectedChannel: val })),
  selectedChannelId: null,
  setSelectedChannelId: (val) => set(() => ({ selectedChannelId: val })),
  fromLive: false,
  setFromLive: (val) => set(() => ({ fromLive: val })),
  liveStreamingIntervalId: [],
  setLiveStreamingIntervalId: (val) =>
    set(() => ({ liveStreamingIntervalId: val })),
  selectedItems: [],
  setSelectedItems: (val) => set(() => ({ selectedItems: val })),
  newBookmarkCount: 0,
  setNewBookmarkCount: (val) => set(() => ({ newBookmarkCount: val })),
  selectedCameras: [],
  setSelectedCameras: (val) => set(() => ({ selectedCameras: val })),
  setGridArray: (id) =>
    set((state) => {
      const newArray = [...state.gridArray]
      // const index = newArray.findIndex((camera) => camera?.camId === id)
      // if (index !== -1) {
      //   newArray[index] = null
      // }
      newArray.forEach((cam, i) => {
        if (cam?.camId === id) {
          newArray[i] = null
        }
      })
      return { gridArray: newArray }
    }),
  pasteStream: (cellId, copyId) =>
    set((state) => {
      const newArray = [...state.gridArray]
      const findStream = newArray.find((camera) => camera?.camId === copyId)
      newArray[cellId] = findStream
      return {
        gridArray: newArray,
      }
    }),
  addCamera: (camera) =>
    set((state) => {
      const newSelectedCameras = camera?.isSingle
        ? [camera]
        : [...state.selectedCameras, camera]
      const newArray = [...state.gridArray]
      newSelectedCameras.forEach((camera, index) => {
        newArray[index] = camera
      })
      return {
        selectedCameras: newSelectedCameras,
        gridArray: newArray,
      }
    }),

  retryCamera: (stream) => {
    set((state) => ({
      selectedCameras: state.selectedCameras.map((camera) =>
        camera.camId === stream.camId
          ? {
              ...stream,
              isLoading: true,
              hasError: false,
              loadingMessage: "Attempting Stream Restart",
            }
          : camera
      ),
    }))
  },
  resetCamera: () => {
    set((state) => {
      const size = state.gridSize
      const newArray = Array(size * size).fill(null)
      return {
        selectedCameras: [],
        gridArray: newArray,
      }
    })
  },
  resetSelectedCamera: (id) =>
    set((state) => ({
      selectedCameras: state.selectedCameras.filter(
        (camera) => camera.camId !== id
      ),
      gridArray: state.gridArray.map((camera) =>
        camera?.camId === id ? null : camera
      ),
    })),

  updateSelectedCamera: async (id, loadingMessage, liveRes) => {
    set((state) => ({
      selectedCameras: state.selectedCameras.map((camera) =>
        camera.camId === id
          ? {
              ...liveRes,
              camId: id,
              name: camera.name,
              isLoading: false,
              loadingMessage: loadingMessage,
              hasError: loadingMessage === "Error" ? true : false,
            }
          : camera
      ),
      gridArray: state.gridArray.map((camera) =>
        camera?.camId === id
          ? {
              ...liveRes,
              camId: id,
              name: camera.name,
              isLoading: false,
              loadingMessage: loadingMessage,
              hasError: loadingMessage === "Error" ? true : false,
            }
          : camera
      ),
    }))

    try {
      // const response = await startLive(liveVideopayload, id)
      // const liveRes = response.data.result[0]
      // await delay(10000)
      // // console.log(liveRes.hlsurl, 'hlsurl')
      // const checkVideoIsLive = await fetch(
      //   `${process.env.NEXT_PUBLIC_URL}${liveRes.hlsurl}`
      // )
      // console.log(checkVideoIsLive.status, "checkVideoIsLive2500")
      // if (checkVideoIsLive.status === 404) {
      //   set((state) => ({
      //     selectedCameras: state.selectedCameras.map((camera) =>
      //       camera.camId === id
      //         ? {
      //             ...liveRes,
      //             camId: id,
      //             name: camera.name,
      //             isLoading: true,
      //             loadingMessage: "Stream Buffering",
      //           }
      //         : camera
      //     ),
      //   }))
      //   await delay(5000)
      // }
      // console.log(checkVideoIsLive.status, "checkVideoIsLive10000")
    } catch (err) {
      console.log(err)
    }
  },

  updateCamera: async (id, liveVideopayload) => {
    try {
      const response = await startLive(liveVideopayload, id)
      const liveRes = response.data.result[0]
      // await delay(10000)
      // console.log(liveRes.hlsurl, 'hlsurl')
      const checkVideoIsLive = await fetch(
        `${process.env.NEXT_PUBLIC_URL}${liveRes.hlsurl}`
      )
      console.log(checkVideoIsLive.status, "checkVideoIsLive2500")
      if (checkVideoIsLive.status === 404) {
        set((state) => {
          const newSelectedCameras = state.selectedCameras.map((camera) =>
            camera.camId === id
              ? {
                  ...liveRes,
                  camId: id,
                  name: camera.name,
                  isLoading: true,
                  loadingMessage: "Stream Buffering",
                }
              : camera
          )
          const newArray = [...state.gridArray]
          newSelectedCameras.forEach((cam, index) => {
            if (cam.camId === id) {
              newArray[index] = cam
            }
          })
          return {
            selectedCameras: newSelectedCameras,
            gridArray: newArray,
          }
        })
        await delay(5000)
      }
      console.log(checkVideoIsLive.status, "checkVideoIsLive10000")
      if (checkVideoIsLive.status === 200) {
        set((state) => {
          const newSelectedCameras = state.selectedCameras.map((camera) =>
            camera.camId === id
              ? {
                  ...liveRes,
                  camId: id,
                  name: camera.name,
                  isLoading: false,
                  loadingMessage: "Stream Loaded",
                }
              : camera
          )
          const newArray = [...state.gridArray]
          newSelectedCameras.forEach((cam, index) => {
            if (cam.camId === id) {
              newArray[index] = cam
            }
          })
          return {
            selectedCameras: newSelectedCameras,
            gridArray: newArray,
          }
        })
      } else {
        set((state) => {
          const newSelectedCameras = state.selectedCameras.map((camera) =>
            camera.camId === id
              ? {
                  hasError: true,
                  camId: id,
                  name: camera.name,
                  isLoading: false,
                  loadingMessage: "Error",
                }
              : camera
          )
          const newArray = [...state.gridArray]
          newSelectedCameras.forEach((cam, index) => {
            if (cam.camId === id) {
              newArray[index] = cam
            }
          })
          return {
            selectedCameras: newSelectedCameras,
            gridArray: newArray,
          }
        })
      }
    } catch (err) {
      console.log(err)
    }
  },
  updateCameraArchive: async (id, payload) => {
    set((state) => ({
      selectedCameras: [
        {
          camId: id,
          isLoading: true,
          isSingle: true,
          name: payload.name,
          loadingMessage: "Loading Archive",
          starttimestamp: payload.starttimestamp,
        },
      ],
    }))
    try {
      const response = await startArchive(payload, id)
      await delay(10000)
      const liveRes = response.data.result[0]
      set((state) => ({
        archiveStreamingId: liveRes.streamsessionid,
      }))
      // setArchiveStreamingId(liveRes[0].streamsessionid)
      // console.log(liveRes.hlsurl, 'hlsurl')
      const checkVideoIsLive = await fetch(
        `${process.env.NEXT_PUBLIC_URL}${liveRes.hlsurl}`
      )
      console.log(checkVideoIsLive.status, "checkVideoIsLive2500")
      if (checkVideoIsLive.status === 404) {
        set((state) => ({
          selectedCameras: state.selectedCameras.map((camera) =>
            camera.camId === id
              ? {
                  ...liveRes,
                  camId: id,
                  name: camera.name,
                  isLoading: true,
                  starttimestamp: payload.starttimestamp,
                  loadingMessage: "Stream Buffering",
                }
              : camera
          ),
        }))
        await delay(5000)
      }
      console.log(checkVideoIsLive.status, "checkVideoIsLive10000")
      if (checkVideoIsLive.status === 200) {
        set((state) => ({
          selectedCameras: state.selectedCameras.map((camera) =>
            camera.camId === id
              ? {
                  ...liveRes,
                  camId: id,
                  name: camera.name,
                  isLoading: false,
                  starttimestamp: payload.starttimestamp,
                  loadingMessage: "Stream Loaded",
                }
              : camera
          ),
        }))
      } else {
        set((state) => ({
          selectedCameras: state.selectedCameras.map((camera) =>
            camera.camId === id
              ? {
                  ...liveRes,
                  hasError: true,
                  camId: id,
                  name: camera.name,
                  isLoading: false,
                  starttimestamp: payload.starttimestamp,
                  loadingMessage: "Error",
                }
              : camera
          ),
        }))
      }
    } catch (err) {
      console.log(err)
    }
  },
  archiveMode: false,
  setArchiveMode: (val) => set(() => ({ archiveMode: val })),
  gridSize: 2,
  gridArray: Array(2 * 2).fill(null),
  setGridSize: (val) =>
    set((state) => {
      const updatedArray = Array(val * val).fill(null)
      const newArray = [...state.selectedCameras]
      for (let i = 0; i < newArray.length; i++) {
        if (i < val * val) {
          updatedArray[i] = newArray[i]
        } else {
          break
        }
      }

      if (newArray.length > val * val) {
        newArray.length = val * val
      }
      return {
        gridArray: updatedArray,
        gridSize: val,
      }
    }),
  eventList: [],
  setEventList: (val) => set(() => ({ eventList: val })),
  selectedEventDetails: null,
  updateEventDetails: (val) => set(() => ({ selectedEventDetails: val })),
  showEventDetails: false,
  setShowEventDetails: (val) => set(() => ({ showEventDetails: val })),
  isEventPopupLoading: false,
  setIsEventPopupLoading: (val) => set(() => ({ isEventPopupLoading: val })),
  violationsData: [],
  setViolationsData: (val) => set(() => ({ violationsData: val })),
  datasetsFlow: [],
  setDatasetsFlow: (val) => set(() => ({ datasetsFlow: val })),
  getSeverityName: (val) => {
    const severity = ["Critical", "Medium", "Low"]
    if (val > -1 && val <= 2) {
      return severity[val]
    } else {
      return "-"
    }
  },
  getVehicleType: (val) => {
    const regType = ["Others", "Private", "Commercial", "Army", "Electrical"]
    if (val > -1 && val <= 4) {
      return regType[val]
    } else {
      return "-"
    }
  },
  getVehicleColor: (val) => {
    const vehicleColor = [
      "",
      "Black",
      "White",
      "Gray",
      "Red",
      "Yellow",
      "Green",
      "Blue",
      "Orange",
      "Silver",
      "Brown",
    ]
    if (val > -1 && val <= 10) {
      return vehicleColor[val]
    } else {
      return "-"
    }
  },
}))
export default useStore
