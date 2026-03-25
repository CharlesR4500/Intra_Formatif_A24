using Microsoft.AspNetCore.SignalR;
using SignalR.Services;

namespace SignalR.Hubs
{
    public class PizzaHub : Hub
    {
        private readonly PizzaManager _pizzaManager;

        public PizzaHub(PizzaManager pizzaManager) {
            _pizzaManager = pizzaManager;
        }

        public override async Task OnConnectedAsync()
        {
            _pizzaManager.AddUser();

            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);

            await base.OnConnectedAsync();
        }


        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _pizzaManager.RemoveUser();

            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SelectChoice(PizzaChoice choice)
        {
            string group = _pizzaManager.GetGroupName(choice);   

            await Groups.AddToGroupAsync(Context.ConnectionId, group);

            await Clients.Caller.SendAsync("UpdatePizzaPrice", _pizzaManager.PIZZA_PRICES[(int)choice]);

            await Clients.Group(group).SendAsync(
                "UpdateNbPizzasAndMoney",
                _pizzaManager.NbPizzas[(int)choice],
                _pizzaManager.Money[(int)choice]
            );
        }

        public async Task UnselectChoice(PizzaChoice choice)
        {
            string group = _pizzaManager.GetGroupName(choice);

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);
        }

        public async Task AddMoney(PizzaChoice choice)
        {
            _pizzaManager.IncreaseMoney(choice);

            string group = _pizzaManager.GetGroupName(choice);

            await Clients.Group(group).SendAsync(
                "UpdateMoney",
                _pizzaManager.Money[(int)choice]
            );
        }

        public async Task BuyPizza(PizzaChoice choice)
        {
            _pizzaManager.BuyPizza(choice);

            string group = _pizzaManager.GetGroupName(choice);

            await Clients.Group(group).SendAsync(
                "UpdateNbPizzasAndMoney",
                _pizzaManager.NbPizzas[(int)choice],
                _pizzaManager.Money[(int)choice]
            );
        }
    }
}
