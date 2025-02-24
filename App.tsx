import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

export default function App() {
  const [speed, setSpeed] = useState(""); // en km/h
  const [pace, setPace] = useState(""); // en min/km
  const [time, setTime] = useState(""); // en minutes
  const [distance, setDistance] = useState(""); // en km
  const [result, setResult] = useState("");
  const [lastModified, setLastModified] = useState("");

  // Convertir km/h en min/km
  const convertSpeedToPace = () => {
    if (!speed) return;
    const speedFloat = parseFloat(speed);
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
    let speedFloat = parseFloat(speed);

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
    let speedFloat = parseFloat(speed);

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
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Convertisseur Running</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Vitesse (km/h)"
          keyboardType="numeric"
          value={speed}
          onChangeText={(text) => { setSpeed(text); setLastModified("speed"); }}
        />
        <Text style={styles.unit}>km/h</Text>
        <TouchableOpacity style={styles.switchButton} onPress={handleConversion}>
          <Text style={styles.switchText}>↔</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Allure (min/km)"
          keyboardType="numeric"
          value={pace}
          onChangeText={(text) => { setPace(text); setLastModified("pace"); }}
        />
        <Text style={styles.unit}>min/km</Text>
      </View>
      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="Temps (min)" keyboardType="numeric" value={time} onChangeText={setTime} />
        <TouchableOpacity style={styles.actionButton} onPress={calculateTime}>
          <Text style={styles.buttonText}>Calculer Temps</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="Distance (km)" keyboardType="decimal-pad" value={distance} onChangeText={setDistance} />
        <TouchableOpacity style={styles.actionButton} onPress={calculateDistance}>
          <Text style={styles.buttonText}>Calculer Distance</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.actionButton} onPress={calculateSpeedAndPace}>
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
    padding: 20,
    paddingTop: 80,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    flex: 1,
    textAlign: "center",
  },
  unit: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  switchButton: {
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    marginHorizontal: 10,
  },
  actionButton: {
    padding: 12,
    backgroundColor: "#28a745",
    borderRadius: 8,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    width: 150
  },
  clearButton: {
    marginTop: 20,
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  switchText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  result: {
    fontSize: 18,
    marginTop: 15,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
});
