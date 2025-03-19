using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class ProgressHub : Hub
{
public async Task SendProgressUpdate(int progress)
{
    // Console.WriteLine($"Sending Progress Update: {progress}");
    await Clients.All.SendAsync("ProgressUpdate", progress);
}

public async Task NotifyProcessCompleted()
{
    // Console.WriteLine("Sending Process Completed Event");
    await Clients.All.SendAsync("ProcessCompleted");
}
}
