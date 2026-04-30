// 1. LRU Page Replacement algorithm 
#include<stdio.h>

int main() {
    int frames[10], pages[30], time[10];
    int n, f, i, j, k, flag, page_fault = 0;
    int least, count = 0;

    printf("Enter number of pages: ");
    scanf("%d", &n);

    printf("Enter page reference string: ");
    for(i = 0; i < n; i++)
        scanf("%d", &pages[i]);

    printf("Enter number of frames: ");
    scanf("%d", &f);

    for(i = 0; i < f; i++)
        frames[i] = -1;

    for(i = 0; i < n; i++) {
        flag = 0;

        for(j = 0; j < f; j++) {
            if(frames[j] == pages[i]) {
                count++;
                time[j] = count;
                flag = 1;
                break;
            }
        }

        if(flag == 0) {
            if(i < f) {
                frames[i] = pages[i];
                count++;
                time[i] = count;
            }
            else {
                least = 0;
                for(j = 1; j < f; j++)
                    if(time[j] < time[least])
                        least = j;

                frames[least] = pages[i];
                count++;
                time[least] = count;
            }
            page_fault++;
        }

        printf("\n");
        for(k = 0; k < f; k++)
            printf("%d\t", frames[k]);
    }

    printf("\n\nTotal Page Faults = %d\n", page_fault);

    return 0;
}