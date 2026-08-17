import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tafsiira Jeylan</Text>

      <Text style={styles.subtitle}>
        Tafsiira Qur'aanaa Afaan Oromoo
      </Text>

      <Text style={styles.description}>
        Sheikh Jeylan Adam
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
  },

  description: {
    fontSize: 16,
  },
});