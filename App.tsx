import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Button } from "react-native";

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

  // Fonction pour nettoyer les entrées utilisateur
  const sanitizeNumber = (value: string) => {
    return value.replace(/,/g, ".");
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
      const distanceFloat = parseFloat(sanitizeNumber(distance));
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

  // Vider les champs
  const handleClear = () => {
    setSpeed("");
    setPace("");
    setTime("");
    setDistance("");
    setResult("");
  };

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
          onChangeText={handlePaceInput}
        />
        <Text style={styles.unit}>min/km</Text>
      </View>
      <TextInput style={styles.input} placeholder="Temps (min)" keyboardType="numeric" value={time} onChangeText={setTime} />
      <Button title="Calculer Temps" onPress={calculateTime} />
      <TextInput style={styles.input} placeholder="Distance (km)" keyboardType="decimal-pad" value={distance} onChangeText={setDistance} />
      <Button title="Calculer Distance" onPress={calculateDistance} />
      <Button title="Calculer Vitesse et Allure" onPress={calculateSpeedAndPace} />
      <Text style={styles.result}>{result}</Text>
      <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.switchText}>Clear 🗑️</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 150,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
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
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  clearButton: {
    padding: 10,
    backgroundColor: "#FF3B30",
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 10,
  },
  switchText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  result: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});
