module.exports = formatResults;

const pb = {
    leGreen: '<:lefte:1207294549622263850>',
    meGreen: '<:middlee:1207294881140056084>',
    reGreen: '<:righte:1207295138817253377>',
    lfGreen: '<:leftf:1207295331268698203>',
    mfGreen: '<:middlef:1207295520431804496>',
    rfGreen: '<:rightf:1207295730826354698>',
    leRed: '<:LER:1207295953695154218>',
    meRed: '<:MER:1207296113971953674>',
    reRed: '<:RER:1207296275905773618>',
    lfRed: '<:LFR:1207296421783543899>',
    mfRed: '<:MFR:1207296566285832223>',
    rfRed: '<:RFR:1207296736599605258>',
};

function calculateColor(upvotePercentage, downvotePercentage) {
    if (upvotePercentage === 0) {
        return 'red'; // All downvotes, set to red
    } else if (downvotePercentage === 0) {
        return 'green'; // All upvotes, set to green
    } else {
        return 'mixed'; // Mixed votes, set to a mix of green and red
    }
}

function formatResults(upvotes = [], downvotes = []) {
    const totalVotes = upvotes.length + downvotes.length;
    const progressBarLength = 26; // Set the length to 26

    const upvotePercentage = upvotes.length / totalVotes;
    const downvotePercentage = downvotes.length / totalVotes;

    const color = calculateColor(upvotePercentage, downvotePercentage);

    const halfProgressBarLength = progressBarLength / 2;
    const filledSquaresGreen = Math.min(Math.round(upvotePercentage * halfProgressBarLength), halfProgressBarLength) || 0;
    const filledSquaresRed = Math.min(Math.round(downvotePercentage * halfProgressBarLength), halfProgressBarLength) || 0;

    const upPercentage = upvotePercentage * 100 || 0;
    const downPercentage = downvotePercentage * 100 || 0;

    const progressBar =
        color === 'red'
            ? pb.lfRed + pb.mfRed.repeat(halfProgressBarLength) + pb.rfRed
            : color === 'green'
            ? pb.lfGreen + pb.mfGreen.repeat(halfProgressBarLength) + pb.rfGreen
            : (filledSquaresGreen ? pb.lfGreen : pb.leGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.mfRed : pb.meRed) +
              (filledSquaresRed ? pb.rfRed : pb.reRed);

    const results = [];
    results.push(
        `:thumbsup: ${upvotes.length} upvotes (${upPercentage.toFixed(1)}%) • :thumbsdown: ${
            downvotes.length
        } downvotes (${downPercentage.toFixed(1)}%)`
    );
    results.push(progressBar);

    return results.join('\n');
}

module.exports = formatResults;
