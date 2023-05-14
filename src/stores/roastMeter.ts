import { ref } from 'vue'
import { defineStore } from 'pinia'
import { pausableWatch, useBluetooth } from '@vueuse/core'

const UUID_ROAST_METER_SERVICE = '875a0ee0-03dd-4225-ae06-35e8ae92b84c'
const UUID_SETTING_SERVICE = '59021473-dfc6-425a-9729-09310ebe535e'

const UUID_AGTRON = 'ce216811-0ad9-4aff-ae29-8b171093a95f'
const UUID_PARTICLE_SENSOR = 'c32afdba-e9f2-453e-9612-85fbf4108ab2'
const UUID_METER_STATE = '8ace2828-996f-48e4-8e9c-8284678b4b57'

const UUID_LED_BRIGHTNESS_LEVEL = '8313695f-3ea1-458b-bd2a-df4aee218514'
const UUID_INTERSECTION_POINT = '69548c4b-87d0-4e3e-ac6c-b143c7b2ab30'
const UUID_DEVIATION = 'd17234fa-0f48-429a-9e9b-f5db774ef682'
const UUID_BLE_NAME = 'cde44fd7-4c1e-42a0-8368-531dc87f6b56'

export const useMeterStore = defineStore('roastMeter', () => {
  const { isConnected, server, requestDevice } = useBluetooth({
    filters: [{ services: [UUID_ROAST_METER_SERVICE] }],
    optionalServices: [UUID_SETTING_SERVICE]
  })

  const agtron = ref<number>(0)
  const particleSensor = ref<number>(0)
  const meterState = ref<number>(0) // 0 setup, 1 warmup, 2 ready, 3 measured

  const ledBrightnessLevel = ref<number>(0)
  const intersectionPoint = ref<number>(0)
  const deviation = ref<number>(0)
  const bleName = ref<string>('Roast Meter xxxx')

  const isGettingMeterReading = ref(false)
  const isGettingMeterSetting = ref(false)

  async function getMeterReading() {
    if (isGettingMeterReading.value) {
      console.log('getMeterReading is running')
      return
    }
    console.log('getMeterReading')
    isGettingMeterReading.value = true

    // Get the battery service:
    const meterService = await server.value.getPrimaryService(UUID_ROAST_METER_SERVICE)

    // Get the current battery level
    const agtronCharacteristic = await meterService.getCharacteristic(UUID_AGTRON)
    const particleCharacteristic = await meterService.getCharacteristic(UUID_PARTICLE_SENSOR)
    const meterStateCharacteristic = await meterService.getCharacteristic(UUID_METER_STATE)

    await agtronCharacteristic.startNotifications()
    await particleCharacteristic.startNotifications()
    await meterStateCharacteristic.startNotifications()

    // Listen to when characteristic value changes on `characteristicvaluechanged` event:
    agtronCharacteristic.addEventListener('characteristicvaluechanged', (event: any) => {
      agtron.value = event.target.value.getUint8(0)
    })

    particleCharacteristic.addEventListener('characteristicvaluechanged', (event: any) => {
      particleSensor.value = event.target.value.getUint32(0)
    })

    meterStateCharacteristic.addEventListener('characteristicvaluechanged', (event: any) => {
      meterState.value = event.target.value.getUint8(0)
    })

    // Convert received buffer to number:
    const agtronValue = await agtronCharacteristic.readValue()
    const particleSensorValue = await particleCharacteristic.readValue()
    const meterStateValue = await meterStateCharacteristic.readValue()

    agtron.value = agtronValue.getUint8(0)
    particleSensor.value = particleSensorValue.getUint32(0)
    meterStateValue.value = meterStateValue.getUint8(0)
  }

  async function getMeterSetting() {
    if (isGettingMeterSetting.value) {
      console.log('getMeterSetting is running')
      return
    }
    console.log('getMeterSetting')
    isGettingMeterSetting.value = true

    if (!isConnected || !server.value) {
      console.log('server not ready!')
      isGettingMeterSetting.value = false
      return
    }

    // Get the battery service:
    console.log('getting setting service')
    const meterSettingService = await server.value.getPrimaryService(UUID_SETTING_SERVICE)

    console.log('getting setting characteristics')
    // Get the current battery level
    const ledBrightnessCharacteristic = await meterSettingService.getCharacteristic(
      UUID_LED_BRIGHTNESS_LEVEL
    )
    const intersectionPointCharacteristic = await meterSettingService.getCharacteristic(
      UUID_INTERSECTION_POINT
    )
    const deviationCharacteristic = await meterSettingService.getCharacteristic(UUID_DEVIATION)
    const bleNameCharacteristic = await meterSettingService.getCharacteristic(UUID_BLE_NAME)

    // Convert received buffer to number:
    const ledBrightnessValue = await ledBrightnessCharacteristic.readValue()
    const intersectionPointValue = await intersectionPointCharacteristic.readValue()
    const deviationValue = await deviationCharacteristic.readValue()
    const bleNameValue = await bleNameCharacteristic.readValue()

    ledBrightnessLevel.value = ledBrightnessValue.getUint8(0)
    intersectionPoint.value = intersectionPointValue.getUint8(0)
    deviation.value = deviationValue.getFloat32(0)
    const decoder = new TextDecoder('utf-8')
    bleName.value = decoder.decode(bleNameValue.buffer)

    isGettingMeterSetting.value = false
  }

  async function saveMeterSetting() {
    if (!isConnected || !server.value) {
      console.log('server not ready!')
      return
    }

    console.log('saving meter setting')

    // Get the battery service:
    console.log('getting setting service')
    const meterSettingService = await server.value.getPrimaryService(UUID_SETTING_SERVICE)

    console.log('getting setting characteristics')
    // Get the current battery level
    const ledBrightnessCharacteristic = await meterSettingService.getCharacteristic(
      UUID_LED_BRIGHTNESS_LEVEL
    )
    const intersectionPointCharacteristic = await meterSettingService.getCharacteristic(
      UUID_INTERSECTION_POINT
    )
    const deviationCharacteristic = await meterSettingService.getCharacteristic(UUID_DEVIATION)
    const bleNameCharacteristic = await meterSettingService.getCharacteristic(UUID_BLE_NAME)

    console.log('writing setting characteristics')
    let buffer = new ArrayBuffer(1)
    let dataView = new DataView(buffer)
    dataView.setUint8(0, ledBrightnessLevel.value)
    await ledBrightnessCharacteristic.writeValueWithResponse(buffer)

    buffer = new ArrayBuffer(1)
    dataView = new DataView(buffer)
    dataView.setUint8(0, intersectionPoint.value)
    await intersectionPointCharacteristic.writeValueWithResponse(buffer)

    buffer = new ArrayBuffer(4)
    dataView = new DataView(buffer)
    dataView.setFloat32(0, deviation.value)
    await deviationCharacteristic.writeValueWithResponse(buffer)

    const encoder = new TextEncoder()
    await bleNameCharacteristic.writeValueWithResponse(encoder.encode(bleName.value))

    console.log('setting characteristics written')
  }

  const subscribeMeterReading = async () => {
    console.log('call subscribing')

    const { stop } = pausableWatch(isConnected, (newIsConnected) => {
      console.log(newIsConnected, server, isGettingMeterReading)
      if (!newIsConnected || !server.value || isGettingMeterReading.value) return
      // Attempt to get the battery levels of the device:
      console.log('start subscribing')
      getMeterReading()
      // We only want to run this on the initial connection, as we will use an event listener to handle updates:
      stop()
    })
  }

  function reset() {
    isGettingMeterReading.value = false
  }

  return {
    requestDevice,
    reset,
    agtron,
    particleSensor,
    meterState,
    ledBrightnessLevel,
    intersectionPoint,
    deviation,
    bleName,
    isConnected,
    getMeterSetting,
    getMeterReading,
    subscribeMeterReading,
    saveMeterSetting
  }
})
