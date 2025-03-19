using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api")]
[ApiController]
public class ProcessController : ControllerBase
{
    private readonly IHubContext<ProgressHub> _hubContext;
    private static List<string> _storedData = new();

    public ProcessController(IHubContext<ProgressHub> hubContext)
    {
        _hubContext = hubContext;
    }

    [HttpPost("startProcess")]
    public async Task<IActionResult> StartProcess()
    {
        for (int i = 0; i <= 100; i += 10)
        {
            await Task.Delay(500); 
            await _hubContext.Clients.All.SendAsync("ProgressUpdate", i);
        }

        _storedData.Add($"Data saved at {DateTime.Now}");
        await _hubContext.Clients.All.SendAsync("ProcessCompleted");

        return Ok();
    }

    [HttpGet("getData")]
    public IActionResult GetData()
    {
        return Ok(_storedData);
    }
}
