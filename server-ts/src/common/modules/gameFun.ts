function checkWin(cells: string[]): boolean {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
        [0, 4, 8], [2, 4, 6]             // Diagonal
    ];

    return winPatterns.some(pattern =>
        cells[pattern[0]] !== '' &&
        cells[pattern[0]] === cells[pattern[1]] &&
        cells[pattern[1]] === cells[pattern[2]]
    );
};

export default checkWin