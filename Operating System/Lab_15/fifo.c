// 1. FIFO Page Replacement algorithm 
#include<stdio.h>

int main() {
    int frames[10], pages[30];
    int n, f, i, j, k, flag, page_fault = 0, index = 0;

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
                flag = 1;
                break;
            }
        }

        if(flag == 0) {
            frames[index] = pages[i];
            index = (index + 1) % f;
            page_fault++;
        }

        printf("\n");
        for(k = 0; k < f; k++)
            printf("%d\t", frames[k]);
    }

    printf("\n\nTotal Page Faults = %d\n", page_fault);

    return 0;
}