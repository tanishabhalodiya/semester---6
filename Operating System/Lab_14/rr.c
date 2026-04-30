// Round Robin (RR) Scheduling algorithm 
#include<stdio.h>
int main(){
    int n , i , time=0, remain, quantum;
    int bt[20], wt[20], tat[20], p[20],rt[20];
    float avg_wt=0,avg_tat=0;

    printf("Enter number of process : \n");
    scanf("%d",&n);

    remain=n;

    printf("Enter burst time for each process : \n");
    for(i=0;i<n;i++){
        printf("Enter burst time for P%d : ",i+1);
        scanf("%d",&bt[i]);
        rt[i]=bt[i];
    }

    printf("Enter time quantum : ");
    scanf("%d",&quantum);

    while(remain > 0){
        for(i=0;i<n;i++){
            if(rt[i]>0){
                if(rt[i]<=quantum){
                    time += rt[i];
                    rt[i]=0;
                    remain--;
                    tat[i]=time;;
                    wt[i]=tat[i]-bt[i];
                }
                else{
                    rt[i]-=quantum;
                    time += quantum;
                }
            }
        }
    }

    printf("\nProcess\tBT\tWT\tTAT\n");
    for(i=0;i<n;i++){
        avg_wt += wt[i];
        avg_tat += tat[i];
        printf("P%d\t%d\t%d\t%d\n",i+1,bt[i],wt[i],tat[i]);
    }

    printf("\nAverage Waiting Time = %.2f\n",avg_wt/n);
    printf("\nAverage Turn Around Time = %.2f\n",avg_tat/n);

}
