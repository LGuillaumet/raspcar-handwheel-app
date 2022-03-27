const POSITION_LIGHT : u32 = 0x1;
const CRUISE_LIGHT : u32 = 0x2;
const FULLHEAD_LIGHT : u32 = 0x3;
const MOTTOR : u32 = 0x4;
const BATTERY : u32 = 0x5;
const HANDBRAKE : u32 = 0x6;
const TURN_SIGNAL_RIGHT : u32 = 0x7;
const TURN_SIGNAL_LEFT : u32 = 0x8;
const AIR_CONDITIONER : u32 = 0x9;
const AIR_SPEEDFAN : u32 = 0xA;
const AIR_TEMPERATURE : u32 = 0xB;
const CAR_TEMPERATURE : u32 = 0xC;

pub struct ValueTypeChange {
    pub propertie_type: u32,
    pub value: u8
}

#[derive(Deserialize, Serialize, Debug, Copy, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CarData {
    pub position_light: bool,
    pub cruise_light: bool,
    pub fullhead_light: bool,
    pub motor: bool, 
    pub battery: bool,
    pub handbrake: bool,
    pub turn_signal_right: bool,
    pub turn_signal_left: bool,
    pub air_conditioner: bool,
    pub air_speed_fan: u8,
    pub air_temperature: u8,
    pub car_temperature: u8
}

impl CarData {

    pub fn cmp_and_set(&mut self, other: CarData) -> Vec<ValueTypeChange>  {

        let mut vec : Vec<ValueTypeChange> = Vec::new();

        if self.position_light != other.position_light {
            self.position_light = other.position_light;
            vec.push(ValueTypeChange { propertie_type: POSITION_LIGHT, value: self.position_light as u8 })
        } 

        if self.cruise_light != other.cruise_light {
            self.cruise_light = other.cruise_light;
            vec.push(ValueTypeChange { propertie_type: CRUISE_LIGHT, value: self.cruise_light as u8 })
        } 

        if self.fullhead_light != other.fullhead_light {
            self.fullhead_light = other.fullhead_light;
            vec.push(ValueTypeChange { propertie_type: FULLHEAD_LIGHT, value: self.fullhead_light as u8 })
        } 

        if self.motor != other.motor {
            self.motor = other.motor;
            vec.push(ValueTypeChange { propertie_type: MOTTOR, value: self.motor as u8 })
        } 

        if self.battery != other.battery {
            self.battery = other.battery;
            vec.push(ValueTypeChange { propertie_type: BATTERY, value: self.battery as u8 })
        } 

        if self.handbrake != other.handbrake {
            self.handbrake = other.handbrake;
            vec.push(ValueTypeChange { propertie_type: HANDBRAKE, value: self.handbrake as u8 })
        } 

        if self.turn_signal_right != other.turn_signal_right {
            self.turn_signal_right = other.turn_signal_right;
            vec.push(ValueTypeChange { propertie_type: TURN_SIGNAL_RIGHT, value: self.turn_signal_right as u8 })
        } 

        if self.turn_signal_left != other.turn_signal_left {
            self.turn_signal_left = other.turn_signal_left;
            vec.push(ValueTypeChange { propertie_type: TURN_SIGNAL_LEFT, value: self.turn_signal_left as u8 })
        }
        
        if self.air_conditioner != other.air_conditioner {
            self.air_conditioner = other.air_conditioner;
            vec.push(ValueTypeChange { propertie_type: AIR_CONDITIONER, value: self.air_conditioner as u8 })
        } 

        if self.air_speed_fan != other.air_speed_fan {
            self.air_speed_fan = other.air_speed_fan;
            vec.push(ValueTypeChange { propertie_type: AIR_SPEEDFAN, value: self.air_speed_fan as u8 })
        } 

        if self.air_temperature != other.air_temperature {
            self.air_temperature = other.air_temperature;
            vec.push(ValueTypeChange { propertie_type: AIR_TEMPERATURE, value: self.air_temperature as u8 })
        }
        
        if self.car_temperature != other.car_temperature {
            self.car_temperature = other.car_temperature;
            vec.push(ValueTypeChange { propertie_type: CAR_TEMPERATURE, value: self.car_temperature as u8 })
        } 

        return vec;
    }

}


