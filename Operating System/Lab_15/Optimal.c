// 1. Optimal Page Replacement algorithm
#include<stdio.h>

int main() {
    int frames[10], pages[30];
    int n, f, i, j, k, flag, page_fault = 0;
    int farthest, replace_index;

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
            if(i < f) {
                frames[i] = pages[i];
            }
            else {
                farthest = -1;
                replace_index = -1;

                for(j = 0; j < f; j++) {
                    int found = 0;
                    for(k = i+1; k < n; k++) {
                        if(frames[j] == pages[k]) {
                            if(k > farthest) {
                                farthest = k;
                                replace_index = j;
                            }
                            found = 1;
                            break;
                        }
                    }
                    if(found == 0) {
                        replace_index = j;
                        break;
                    }
                }

                frames[replace_index] = pages[i];
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