import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function App() {
  const [speed, setSpeed] = useState(""); // en km/h
  const [pace, setPace] = useState(""); // en min/km
  const [time, setTime] = useState(""); // en minutes
  const [distance, setDistance] = useState(""); // en km
  const [result, setResult] = useState("");
  const [lastModified, setLastModified] = useState("");

  // Remplace "," par "."
  const sanitizeNumber = (value: string) => {
    return value.replace(/,/g, ".");
  };

  // Gérer l'entrée de l'allure avec un pattern x:xx
  const handlePaceInput = (text: string) => {
    const cleanedText = text.replace(/[^0-9]/g, "");
    if (cleanedText.length > 4) return;

    let formattedPace = cleanedText;
    if (cleanedText.length > 2) {
      formattedPace = `${cleanedText.slice(0, cleanedText.length - 2)}:${cleanedText.slice(-2)}`;
    }
    setPace(formattedPace);
    setLastModified("pace");
  };

  // Convertir km/h en min/km
  const convertSpeedToPace = () => {
    if (!speed) return;
    const speedFloat = parseFloat(sanitizeNumber(speed));
    if (speedFloat === 0) return;
    const paceInMinutes = 60 / speedFloat;
    const minutes = Math.floor(paceInMinutes);
    const seconds = Math.round((paceInMinutes - minutes) * 60);
    setPace(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
  };

  // Convertir min/km en km/h
  const convertPaceToSpeed = () => {
    if (!pace) return;
    const [minutes, seconds] = pace.split(":").map(Number);
    const paceFloat = minutes + seconds / 60;
    setSpeed((60 / paceFloat).toFixed(2));
  };

  const handleConversion = () => {
    if (lastModified === "speed") {
      convertSpeedToPace();
    } else if (lastModified === "pace") {
      convertPaceToSpeed();
    }
  };

  // Calculer distance parcourue
  const calculateDistance = () => {
    if (!time) return;
    let speedFloat = parseFloat(sanitizeNumber(speed));

    if (!speedFloat && pace) {
      const [minutes, seconds] = pace.split(":").map(Number);
      const paceFloat = minutes + seconds / 60;
      speedFloat = 60 / paceFloat;
    }

    if (speedFloat) {
      const timeFloat = parseFloat(time);
      setDistance((speedFloat * (timeFloat / 60)).toFixed(2));
    }
  };

  // Calculer temps nécessaire pour parcourir une distance donnée
  const calculateTime = () => {
    if (!distance) return;
    let speedFloat = parseFloat(sanitizeNumber(speed));

    if (!speedFloat && pace) {
      const [minutes, seconds] = pace.split(":").map(Number);
      const paceFloat = minutes + seconds / 60;
      speedFloat = 60 / paceFloat;
    }

    if (speedFloat > 0) {
      const distanceFloat = parseFloat(distance);
      setTime(((distanceFloat / speedFloat) * 60).toFixed(2));
    }
  };

  // Formater les minutes en Heure minutes
  const formatTime = (minutes: number) => {
    if (!minutes) return "0 min";

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);

    if (hours > 0) {
      return `${hours}h${remainingMinutes < 10 ? "0" : ""}${remainingMinutes}`;
    } else {
      return `${remainingMinutes}`;
    }
  };

  // Calculer vitesse et allure moyennes
  const calculateSpeedAndPace = () => {
    if (!distance || !time) return;
    const distanceFloat = parseFloat(distance);
    const timeFloat = parseFloat(time);
    const calculatedSpeed = (distanceFloat / (timeFloat / 60)).toFixed(2);
    const paceInMinutes = timeFloat / distanceFloat;
    const minutes = Math.floor(paceInMinutes);
    const seconds = Math.round((paceInMinutes - minutes) * 60);
    setResult(`Vitesse: ${calculatedSpeed} km/h\nAllure: ${minutes}:${seconds < 10 ? "0" : ""}${seconds} min/km`);
    setSpeed("");
    setPace("");
  };
  console.log((!distance) || (!pace && !distance))

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Convertisseur Running</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.inputSpeeds}
          placeholder="Vitesse"
          value={speed}
          onChangeText={(text) => { setSpeed(text); setLastModified("speed"); }}
        />
        <Text style={styles.unit}>km/h</Text>
        <TouchableOpacity style={styles.switchButton} onPress={handleConversion}>
          <Text style={styles.switchText}>↔</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.inputSpeeds}
          placeholder="Allure"
          value={pace}
          onChangeText={handlePaceInput}
        />
        <Text style={styles.unit}>min/km</Text>
      </View>
      <View style={styles.rowHour}>
        {parseFloat(time) > 60 && <Text style={styles.timeUnit}>{formatTime(parseFloat(time))}</Text>}
      </View>
      <View style={styles.row}>
        <TextInput inlineImageLeft='search_icon' style={styles.inputStat} placeholder="Temps (min)" keyboardType="numeric" value={time} onChangeText={setTime} />
        <Text style={styles.unit}>min</Text>
        <TouchableOpacity style={[styles.actionButton, !(distance && (pace || speed)) && styles.disabledButton]} onPress={calculateTime} disabled={!(distance && (pace || speed))}>
          <Text style={styles.buttonText}>Calculer Temps</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TextInput style={styles.inputStat} placeholder="Distance (km)" keyboardType="decimal-pad" value={distance} onChangeText={setDistance} />
        <Text style={styles.unit}>km</Text>
        <TouchableOpacity style={[styles.actionButton, !(time && (pace || speed)) && styles.disabledButton]} onPress={calculateDistance} disabled={!(time && (pace || speed))}>
          <Text style={styles.buttonText}>Calculer Distance</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.calculateButton, !(time && distance) && styles.disabledCalculateButton]} onPress={calculateSpeedAndPace} disabled={!(time && distance)}>
        <Text style={styles.switchText}>Calculer Vitesse & Allure</Text>
      </TouchableOpacity>
      <Text style={styles.result}>{result}</Text>
      <TouchableOpacity style={styles.clearButton} onPress={() => { setSpeed(""); setPace(""); setTime(""); setDistance(""); setResult(""); }}>
        <Text style={styles.switchText}>Clear 🗑️</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f8ff",
    width: "100%"
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 80,
    textAlign: "center",
    color: "#003366",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
  },
  rowHour: {
    flexDirection: "row",
    width: "100%",
  },
  inputSpeeds: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fefefe",
    minWidth:70,
    maxWidth:100,
    flex: 1,
  },
  inputStat: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fefefe",
    flex: 1,
    minWidth: 100
  },
  unit: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#003366",
  },
  switchButton: {
    padding: 12,
    backgroundColor: "#00509E",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  actionButton: {
    padding: 10,
    backgroundColor: "#045cbd",
    borderRadius: 5,
    marginLeft: 10,
    width: 165,
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
    opacity: 0.5,
  },
  calculateButton: {
    padding: 15,
    backgroundColor: "#003366",
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  disabledCalculateButton: {
    padding: 15,
    backgroundColor: "#A0A0A0",
    opacity: 0.5,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButton: {
    marginTop: 20,
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  switchText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  result: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#003366",
  },
  timeUnit: {
    marginLeft: 10,
    fontSize: 12,
    color: "#003366",
    minWidth: 40
  },
});
