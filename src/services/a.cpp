
#include <iostream>
#include <vector>
using namespace std;

// Helper function to swap two elements
inline void swap(int &a, int &b)
{
    int temp = a;
    a = b;
    b = temp;
}

// Partition function for quicksort
int partition(int arr[], int low, int high)
{
    int pivot = arr[high]; // choose the last element as pivot
    int i = low - 1;       // index of smaller element

    for (int j = low; j <= high - 1; ++j)
    {
        if (arr[j] <= pivot)
        { // if current element is smaller than or equal to pivot
            ++i;
            swap(arr[i], arr[j]); // move it to the front part
        }
    }
    swap(arr[i + 1], arr[high]); // place pivot in the correct position
    return (i + 1);
}

// QuickSort implementation
void quickSort(int arr[], int low, int high)
{
    if (low < high)
    {
        int pi = partition(arr, low, high); // partitioning index
        quickSort(arr, low, pi - 1);        // sort elements before partition
        quickSort(arr, pi + 1, high);       // sort elements after partition
    }
}

// Utility to print array
void printArray(const int arr[], int size)
{
    for (int i = 0; i < size; ++i)
        cout << arr[i] << ' ';
    cout << '\n';
}

int main()
{
    int arr[] = {10, 7, 8, 9, 1, 5};
    int n = sizeof(arr) / sizeof(arr[0]);

    cout << "Original array:\n";
    printArray(arr, n);

    quickSort(arr, 0, n - 1);

    cout << "Sorted array:\n";
    printArray(arr, n);

    return 0;
}