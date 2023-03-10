from dataclasses import dataclass
from typing import Iterator, Any

def int64_from_iter(it: Iterator[bytes]):
    return int.from_bytes(next(it), "big")

@dataclass
class Grid:
    x: int
    y: int

    @staticmethod
    def from_iter(it: Iterator[bytes]):
        x = int64_from_iter(it)
        y = int64_from_iter(it)
        return Grid(x, y)

    def to_json(self) -> Any:
        return {"x": self.x, "y": self.y}

@dataclass
class SingleBlock:
    id: int
    type: int
    status: int
    index: Grid
    raw_index: Grid

    @staticmethod
    def from_iter(it: Iterator[bytes]):
        id = int64_from_iter(it)
        type = int64_from_iter(it)
        status = int64_from_iter(it)
        index = Grid.from_iter(it)
        raw_index = Grid.from_iter(it)
        return SingleBlock(id, type, status, index, raw_index)

    def to_json(self) -> Any:
        return {
            "id": self.id,
            "type": self.type,
            "status": self.status,
            "index": self.index.to_json(),
            "raw_index": self.index.to_json(),
        }

    @staticmethod
    def from_iter(it: Iterator[bytes]):
        x = int64_from_iter(it)
        y = int64_from_iter(it)
        return Star(x, y)

    def to_json(self) -> Any:
        return {"x": self.x, "y": self.y}

@dataclass
class boardSummary:
    single_block: list[SingleBlock]

    @staticmethod
    def from_iter(it: Iterator[bytes]):
        block_array_len = int64_from_iter(it)
        block_array = [SingleBlock.from_iter(it) for _ in range(block_array_len)]
        return BoardSet(
            block_array_len,
            block_array,
        )
