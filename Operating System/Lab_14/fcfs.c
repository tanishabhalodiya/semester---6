#include <stdio.h>

struct Process {
    int pid;
    int bt;
    int wt;
    int tat;
};

int main() {
    int n, i;
    float total_wt = 0, total_tat = 0;
    struct Process p[20];

    printf("Enter number of processes: ");
    scanf("%d", &n);

    // Input burst time
    for(i = 0; i < n; i++) {
        p[i].pid = i + 1;
        printf("Enter burst time of P%d: ", p[i].pid);
        scanf("%d", &p[i].bt);
    }

    // FCFS logic
    p[0].wt = 0;

    for(i = 1; i < n; i++) {
        p[i].wt = p[i-1].wt + p[i-1].bt;
    }

    for(i = 0; i < n; i++) {
        p[i].tat = p[i].wt + p[i].bt;
        total_wt += p[i].wt;
        total_tat += p[i].tat;
    }

    // Output
    printf("\nPID\tBT\tWT\tTAT\n");
    for(i = 0; i < n; i++) {
        printf("P%d\t%d\t%d\t%d\n",
               p[i].pid, p[i].bt, p[i].wt, p[i].tat);
    }

    printf("\nAverage Waiting Time = %.2f", total_wt/n);
    printf("\nAverage Turnaround Time = %.2f\n", total_tat/n);

    return 0;
}
// #include <stdio.h>
// // 1. First-Come, First-Served (FCFS) Scheduling algorithm 

// int main() {
//     int n, i;
//     int bt[10], wt[10], tat[10];
//     float avg_wt = 0, avg_tat = 0;

//     printf("Enter number of processes: ");
//     scanf("%d", &n);

//     printf("Enter Burst Time for each process:\n");
//     for(i = 0; i < n; i++) {
//         printf("P%d: ", i + 1);
//         scanf("%d", &bt[i]);
//     }

//     // Waiting time for first process is 0
//     wt[0] = 0;

//     // Calculate waiting time
//     for(i = 1; i < n; i++) {
//         wt[i] = wt[i - 1] + bt[i - 1];
//     }

//     // Calculate turnaround time
//     for(i = 0; i < n; i++) {
//         tat[i] = wt[i] + bt[i];
//         avg_wt += wt[i];
//         avg_tat += tat[i];
//     }

//     avg_wt /= n;
//     avg_tat /= n;

//     printf("\nProcess\tBurst Time\tWaiting Time\tTurnaround Time\n");
//     for(i = 0; i < n; i++) {
//         printf("P%d\t%d\t\t%d\t\t%d\n", i + 1, bt[i], wt[i], tat[i]);
//     }

//     printf("\nAverage Waiting Time = %.2f", avg_wt);
//     printf("\nAverage Turnaround Time = %.2f\n", avg_tat);

//     return 0;
// }
