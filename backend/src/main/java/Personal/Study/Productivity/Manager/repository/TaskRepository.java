package Personal.Study.Productivity.Manager.repository;

import Personal.Study.Productivity.Manager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}