import { ref } from 'vue'
import { defineStore } from 'pinia'
import { pausableWatch, useBluetooth } from '@vueuse/core'

export const useMeterStore = defineStore('roastMeter', () => {
  const { isConnected, server, requestDevice } = useBluetooth({
    filters: [{ services: ['875a0ee0-03dd-4225-ae06-35e8ae92b84c'] }],
    optionalServices: ['59021473-dfc6-425a-9729-09310ebe535e']
  })

  const agtron = ref<number>(0)
  const particleSensor = ref<number>(0)

  const ledBrightnessLevel = ref<undefined | number>()
  const intersectionPoint = ref<undefined | number>()
  const deviation = ref<undefined | number>()
  const bleName = ref<undefined | string>()

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
    const meterService = await server.value.getPrimaryService(
      '875a0ee0-03dd-4225-ae06-35e8ae92b84c'
    )

    // Get the current battery level
    const agtronCharacteristic = await meterService.getCharacteristic(
      'ce216811-0ad9-4aff-ae29-8b171093a95f'
    )
    const particleCharacteristic = await meterService.getCharacteristic(
      'c32afdba-e9f2-453e-9612-85fbf4108ab2'
    )

    await agtronCharacteristic.startNotifications()
    await particleCharacteristic.startNotifications()

    // Listen to when characteristic value changes on `characteristicvaluechanged` event:
    agtronCharacteristic.addEventListener('characteristicvaluechanged', (event: any) => {
      agtron.value = event.target.value.getUint8(0)
    })

    particleCharacteristic.addEventListener('characteristicvaluechanged', (event: any) => {
      particleSensor.value = event.target.value.getUint32(0)
    })

    // Convert received buffer to number:
    const agtronValue = await agtronCharacteristic.readValue()
    const particleSensorValue = await particleCharacteristic.readValue()

    agtron.value = agtronValue.getUint8(0)
    particleSensor.value = particleSensorValue.getUint32(0)
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
    const meterSettingService = await server.value.getPrimaryService(
      '59021473-dfc6-425a-9729-09310ebe535e'
    )

    console.log('getting setting characteristics')
    // Get the current battery level
    const ledBrightnessCharacteristic = await meterSettingService.getCharacteristic(
      '8313695f-3ea1-458b-bd2a-df4aee218514'
    )
    const intersectionPointCharacteristic = await meterSettingService.getCharacteristic(
      '69548c4b-87d0-4e3e-ac6c-b143c7b2ab30'
    )
    const deviationCharacteristic = await meterSettingService.getCharacteristic(
      'd17234fa-0f48-429a-9e9b-f5db774ef682'
    )
    const bleNameCharacteristic = await meterSettingService.getCharacteristic(
      'cde44fd7-4c1e-42a0-8368-531dc87f6b56'
    )

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
    const meterSettingService = await server.value.getPrimaryService(
      '59021473-dfc6-425a-9729-09310ebe535e'
    )

    console.log('getting setting characteristics')
    // Get the current battery level
    const ledBrightnessCharacteristic = await meterSettingService.getCharacteristic(
      '8313695f-3ea1-458b-bd2a-df4aee218514'
    )
    const intersectionPointCharacteristic = await meterSettingService.getCharacteristic(
      '69548c4b-87d0-4e3e-ac6c-b143c7b2ab30'
    )
    const deviationCharacteristic = await meterSettingService.getCharacteristic(
      'd17234fa-0f48-429a-9e9b-f5db774ef682'
    )
    const bleNameCharacteristic = await meterSettingService.getCharacteristic(
      'cde44fd7-4c1e-42a0-8368-531dc87f6b56'
    )

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
