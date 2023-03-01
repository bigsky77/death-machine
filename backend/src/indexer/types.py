from dataclasses import dataclass
from typing import Iterator, Any

def int64_from_iter(it: Iterator[bytes]):
    return int.from_bytes(next(it), "big")

@dataclass
class Star:
    x: int
    y: int
    isActive: int

    @staticmethod
    def from_iter(it: Iterator[bytes]):
        x = int64_from_iter(it)
        y = int64_from_iter(it)
        return Star(x, y)

    def to_json(self) -> Any:
        return {"x": self.x, "y": self.y}

@dataclass
class Enemy:
    x: int
    y: int
    isActive: int

    @staticmethod
    def from_iter(it: Iterator[bytes]):
        x = int64_from_iter(it)
        y = int64_from_iter(it)
        return Star(x, y)

    def to_json(self) -> Any:
        return {"x": self.x, "y": self.y}

@dataclass
class BoardSet:
    stars: list[Star]
    enemies: list[Enemy]

    @staticmethod
    def from_iter(it: Iterator[bytes]):
        star_array_len = int64_from_iter(it)
        star_array = [Star.from_iter(it) for _ in range(star_array_len)]
        enemy_array_len = int64_from_iter(it)
        enemy_array = [Enemy.from_iter(it) for _ in range(enemy_array_len)]
        player_address = int64_from_iter(it)
        return BoardSet(
            star_array_len,
            star_array,
            enemy_array_len,
            enemy_array,
            player_address,
        )

