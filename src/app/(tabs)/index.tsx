import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-green-50 px-6">
      <Text className="text-3xl font-bold text-green-800">
        Tafsiira Jeylan
      </Text>

      <Text className="mt-2 text-center text-lg text-gray-600">
        Tafsiira Qur'aanaa Afaan Oromoo
      </Text>

      <Text className="mt-2 text-base text-gray-500">
        Sheikh Jeylan Adam
      </Text>
    </View>
  );
}