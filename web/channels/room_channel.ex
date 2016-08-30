defmodule PhoenixChatDemo.RoomChannel do
  use PhoenixChatDemo.Web, :channel
  require IEx

  def join("room:" <> _id, _params, socket) do
    {:ok, socket}
  end

  def handle_in("publish_message", %{"body" => body, "username" => user}, socket) do
    broadcast!(socket, "new_message", %{body: body, username: user})
    {:reply, :ok, socket}
  end
end
