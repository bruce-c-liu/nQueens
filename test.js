//08 queens takes                                                              92 solutions * 3.8
//09 queens takes                                                             352 solutions * 2.1
//10 queens takes                                                             724 solutions * 3.6
//11 queens takes                                                           2,680 solutions * 5.1
//12 queens takes   40~, 3.8, 0.469,  0.2,  0.1 seconds                    14,200 solutions
//13 queens takes  220~,  22,  2.57,  0.8,  0.5 seconds                    73,712 solutions
//14 queens takes 1410~, 141,   ???,  4.6,  2.3 seconds                   365,596 solutions
//15 queens takes 9370~, 937,   ???, 29.4, 14.6 seconds                 2,279,184 solutions
//16 queens takes ?????????????????,  200,  100 seconds                14,772,512 solutions
//17 queens takes ?????????????????, 1438,      seconds (11 minutes~)
var numQueens = 10;

var t0 = performance.now();
countNQueensSolutions(numQueens);
var t1 = performance.now();
console.log(numQueens, "queens takes", (t1-t0)/1000, "seconds");

