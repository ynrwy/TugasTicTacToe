import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Square = "🐱" | "🐶" | null;

interface WinResult {
  winner: Square;
  lineIndex: number | null;
}

export default function App() {
  const [board, setBoard] = useState<Square[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);

  // Kombinasi garis kemenangan
  const lines = [
    [0, 1, 2], // 0: Baris 1 (Horizontal Top)
    [3, 4, 5], // 1: Baris 2 (Horizontal Middle)
    [6, 7, 8], // 2: Baris 3 (Horizontal Bottom)
    [0, 3, 6], // 3: Kolom 1 (Vertical Left)
    [1, 4, 7], // 4: Kolom 2 (Vertical Middle)
    [2, 5, 8], // 5: Kolom 3 (Vertical Right)
    [0, 4, 8], // 6: Diagonal Kiri Top ke Kanan Bottom
    [2, 4, 6], // 7: Diagonal Kanan Top ke Kiri Bottom
  ];

  const calculateWinner = (squares: Square[]): WinResult => {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { winner: squares[a], lineIndex: i };
      }
    }
    return { winner: null, lineIndex: null };
  };

  const { winner, lineIndex } = calculateWinner(board);
  const isBoardFull = board.every((square) => square !== null);

  const handlePress = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? "🐱" : "🐶";

    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const renderSquare = (index: number) => {
    return (
      <TouchableOpacity
        style={styles.square}
        onPress={() => handlePress(index)}
        activeOpacity={0.7}
      >
        <Text style={styles.squareText}>{board[index]}</Text>
      </TouchableOpacity>
    );
  };

  // Render Garis Kemenangan berdasarkan lineIndex
  const renderWinningLine = () => {
    if (lineIndex === null) return null;

    const lineStyles: Record<number, object> = {
      0: styles.lineRow0,
      1: styles.lineRow1,
      2: styles.lineRow2,
      3: styles.lineCol0,
      4: styles.lineCol1,
      5: styles.lineCol2,
      6: styles.lineDiagLeft,
      7: styles.lineDiagRight,
    };

    return <View style={[styles.winningLine, lineStyles[lineIndex]]} />;
  };

  let status: string;
  if (winner) {
    status = `Pemenang: ${winner}!`;
  } else if (isBoardFull) {
    status = "Permainan Seri (Draw)!";
  } else {
    status = `Giliran Pemain: ${xIsNext ? "🐱" : "🐶"}`;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <Text style={styles.status}>{status}</Text>

      {/* Container Papan Utama */}
      <View style={styles.boardContainer}>
        <View style={styles.board}>
          <View style={styles.row}>
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </View>
          <View style={styles.row}>
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </View>
          <View style={styles.row}>
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </View>
        </View>

        {/* Garis Kemenangan diletakkan secara Overlay */}
        {renderWinningLine()}
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Mulai Ulang</Text>
      </TouchableOpacity>

      <Text style={styles.watermark}>- TicTacToe by Yovi -</Text>
    </SafeAreaView>
  );
}

const BOARD_SIZE = 270; // 3 x 90px kotak

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "600",
    color: "#555",
  },
  boardContainer: {
    position: "relative",
    width: BOARD_SIZE + 8, // menyesuaikan border papan 4px * 2
    height: BOARD_SIZE + 8,
  },
  board: {
    borderWidth: 4,
    borderColor: "#333",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
  },
  square: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  squareText: {
    fontSize: 40,
  },
  resetButton: {
    marginTop: 30,
    backgroundColor: "#2ecc71",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  watermark: {
    marginTop: 15,
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
    letterSpacing: 1,
  },

  /* Stylings Garis Kemenangan */
  winningLine: {
    position: "absolute",
    backgroundColor: "#e74c3c",
    borderRadius: 4,
    zIndex: 10,
  },

  // Garis Horizontal (Baris)
  lineRow0: {
    top: 45,
    left: 10,
    width: BOARD_SIZE - 12,
    height: 6,
  },
  lineRow1: {
    top: 135,
    left: 10,
    width: BOARD_SIZE - 12,
    height: 6,
  },
  lineRow2: {
    top: 225,
    left: 10,
    width: BOARD_SIZE - 12,
    height: 6,
  },

  // Garis Vertikal (Kolom)
  lineCol0: {
    left: 45,
    top: 10,
    height: BOARD_SIZE - 12,
    width: 6,
  },
  lineCol1: {
    left: 135,
    top: 10,
    height: BOARD_SIZE - 12,
    width: 6,
  },
  lineCol2: {
    left: 225,
    top: 10,
    height: BOARD_SIZE - 12,
    width: 6,
  },

  // Garis Diagonal (Miring)
  lineDiagLeft: {
    top: 135,
    left: -15,
    width: BOARD_SIZE + 38,
    height: 6,
    transform: [{ rotate: "45deg" }],
  },
  lineDiagRight: {
    top: 135,
    left: -15,
    width: BOARD_SIZE + 38,
    height: 6,
    transform: [{ rotate: "-45deg" }],
  },
});
